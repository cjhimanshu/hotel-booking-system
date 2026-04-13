# API Error Code Reference

## Authentication Errors (401)

| Code       | Error                        | Solution                                |
| ---------- | ---------------------------- | --------------------------------------- |
| `AUTH_001` | Missing authorization header | Include `Authorization: Bearer [token]` |
| `AUTH_002` | Invalid token                | Re-authenticate and get a new token     |
| `AUTH_003` | Token expired                | Refresh token or re-login               |
| `AUTH_004` | Invalid credentials          | Check email and password                |
| `AUTH_005` | User not found               | Register a new account                  |

## Validation Errors (422)

| Code      | Error                  | Solution                         |
| --------- | ---------------------- | -------------------------------- |
| `VAL_001` | Invalid email format   | Provide valid email              |
| `VAL_002` | Password too short     | Password must be 6+ characters   |
| `VAL_003` | Phone number invalid   | Provide 10-digit phone number    |
| `VAL_004` | Date range invalid     | Check-out must be after check-in |
| `VAL_005` | Missing required field | Provide all required fields      |

## Resource Errors (404)

| Code      | Error             | Solution         |
| --------- | ----------------- | ---------------- |
| `RES_001` | Room not found    | Check room ID    |
| `RES_002` | Booking not found | Check booking ID |
| `RES_003` | User not found    | Check user ID    |

## Server Errors (500)

| Code      | Error                      | Solution                  |
| --------- | -------------------------- | ------------------------- |
| `SRV_001` | Database connection failed | Check MongoDB connection  |
| `SRV_002` | Payment processing failed  | Retry or contact support  |
| `SRV_003` | Email sending failed       | Check email configuration |
| `SRV_004` | Internal server error      | Contact support           |

## Rate Limit Errors (429)

| Code       | Error                       | Solution                         |
| ---------- | --------------------------- | -------------------------------- |
| `RATE_001` | Too many login attempts     | Wait 15 minutes before retry     |
| `RATE_002` | Too many payment attempts   | Wait 1 hour before retry         |
| `RATE_003` | General rate limit exceeded | Wait before making more requests |
