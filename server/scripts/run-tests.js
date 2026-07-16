const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Module = require('module');

const rootDir = path.join(__dirname, '..');
const skipDirectories = new Set(['node_modules', 'uploads']);

const collectJsFiles = (directory, output) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirectories.has(entry.name)) {
        collectJsFiles(path.join(directory, entry.name), output);
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      output.push(path.join(directory, entry.name));
    }
  }
};

const checkSyntax = () => {
  const filesToCheck = [];
  collectJsFiles(rootDir, filesToCheck);

  const failedFiles = [];
  for (const filePath of filesToCheck) {
    const result = spawnSync(process.execPath, ['--check', filePath], {
      stdio: 'ignore',
    });

    if (result.status !== 0) {
      failedFiles.push(path.relative(rootDir, filePath));
    }
  }

  assert.deepStrictEqual(
    failedFiles,
    [],
    `Syntax check failed for: ${failedFiles.join(', ')}`
  );
  return filesToCheck.length;
};

const createFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

const createMockResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

const withMockedModules = (mocks, loadModule) => {
  const originalLoad = Module._load;
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request];
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return loadModule();
  } finally {
    Module._load = originalLoad;
  }
};

const clearModuleCache = (modulePath) => {
  delete require.cache[require.resolve(modulePath)];
};

const testAuthMiddleware = () => {
  const { protect, admin } = require(
    path.join(rootDir, 'middleware', 'authMiddleware')
  );

  let response = createMockResponse();
  protect({ headers: {} }, response, () => {});
  assert.strictEqual(response.statusCode, 401);
  assert.deepStrictEqual(response.body, { message: 'Not authorized' });

  response = createMockResponse();
  admin({ user: { role: 'user' } }, response, () => {});
  assert.strictEqual(response.statusCode, 403);
  assert.deepStrictEqual(response.body, { message: 'Admin access only' });
};

const testPaymentController = async () => {
  const razorpayCalls = [];
  const originalDateNow = Date.now;
  Date.now = () => 1760000000000;

  try {
    const paymentController = withMockedModules(
      {
        razorpay: class RazorpayMock {
          constructor(config) {
            this.config = config;
            this.orders = {
              create: async (options) => {
                razorpayCalls.push(options);
                return {
                  id: 'order_test_123',
                  amount: options.amount,
                  currency: options.currency,
                };
              },
            };
          }
        },
        '../models/Room': {
          findById: async () => ({ price: 2000 }),
        },
        '../utils/logger': {
          error: () => {},
          info: () => {},
          debug: () => {},
        },
      },
      () => {
        const modulePath = path.join(
          rootDir,
          'controllers',
          'paymentController'
        );
        clearModuleCache(modulePath);
        return require(modulePath);
      }
    );

    let response = createMockResponse();
    await paymentController.createOrder({ body: {} }, response);
    assert.strictEqual(response.statusCode, 400);
    assert.match(response.body.message, /required/i);

    response = createMockResponse();
    await paymentController.createOrder(
      {
        body: {
          room: 'room_1',
          checkIn: '2026-07-01',
          checkOut: '2026-07-04',
        },
      },
      response
    );

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.amount, 600000);
    assert.strictEqual(response.body.currency, 'INR');
    assert.strictEqual(razorpayCalls.length, 1);
    assert.deepStrictEqual(razorpayCalls[0], {
      amount: 600000,
      currency: 'INR',
      receipt: 'receipt_1760000000000',
    });
  } finally {
    Date.now = originalDateNow;
  }
};

const testBookingController = () => {
  const bookingCreates = [];

  const bookingController = withMockedModules(
    {
      '../models/Booking': {
        find: () => ({
          select: async () => [],
        }),
        create: async (payload) => {
          bookingCreates.push(payload);
          return payload;
        },
        findById: async () => null,
      },
      '../models/Room': {
        findById: async () => ({
          price: 1500,
          isAvailable: true,
          maxGuests: 4,
        }),
      },
    },
    () => {
      const modulePath = path.join(rootDir, 'controllers', 'bookingController');
      clearModuleCache(modulePath);
      return require(modulePath);
    }
  );

  const response = createMockResponse();
  return bookingController
    .createBooking(
      {
        user: { id: 'user_1' },
        body: {
          room: 'room_1',
          checkIn: createFutureDate(7),
          checkOut: createFutureDate(9),
          numberOfGuests: 2,
          paymentMethod: 'razorpay',
          totalPrice: 1,
          guestDetails: { name: 'Jane', email: 'jane@example.com' },
        },
      },
      response
    )
    .then(() => {
      assert.strictEqual(response.statusCode, 201);
      assert.strictEqual(bookingCreates.length, 1);
      assert.strictEqual(bookingCreates[0].totalPrice, 3000);
      assert.strictEqual(bookingCreates[0].paymentStatus, 'paid');
    });
};

const main = async () => {
  const checkedFiles = checkSyntax();
  await testPaymentController();
  testAuthMiddleware();
  await testBookingController();
  console.log(
    `Checked ${checkedFiles} JavaScript files and ran server behavioral tests.`
  );
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
