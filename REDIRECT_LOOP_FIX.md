# Redirect Loop Troubleshooting & Fixes

## Issues Fixed

### 1. **Redirect Loop in Authentication**

**Problem:** Firefox error "redirecting the request in a way that will never complete"

**Causes:**

- Session not properly initialized
- Auth guard checking for `userId` without verifying session object exists
- Session store using wrong database URL
- Missing body-parser middleware

**Solutions Applied:**
✅ Enhanced auth guard with null-safety checks
✅ Updated session store to use `DB_URL` from `.env`
✅ Added body parser middleware before routes
✅ Added secure cookie settings with proper maxAge

### 2. **Session Configuration**

**Changes Made:**

- Session secret now uses `SESSION_SECRET` from `.env`
- Database URL now uses `DB_URL` from `.env`
- Added `httpOnly: true` to prevent XSS attacks
- Added `maxAge: 24 hours` for session expiration
- Set `secure: false` (change to `true` if using HTTPS)

### 3. **Deprecation Warnings**

**Fixed:** Replaced deprecated `connect-flash` with custom middleware

- No more `util.isArray()` deprecation warnings
- Same functionality with modern JavaScript

---

## How Authentication Flow Works Now

1. **User not logged in:**

   - Visits `/login` → `notAuth` guard checks session
   - Session doesn't exist or `userId` is empty → proceeds to login page ✅

2. **User logs in:**

   - POST `/login` → Creates session with `userId`
   - Session stored in MongoDB
   - Redirects to `/` (dashboard) ✅

3. **User on dashboard:**

   - GET `/` → `isAuth` guard checks session
   - `userId` exists in session → renders dashboard ✅

4. **User visits login after logged in:**
   - GET `/login` → `notAuth` guard checks session
   - `userId` exists → redirects to `/` ✅

---

## Files Modified

### 1. `app.js`

- Added body-parser middleware
- Fixed session store database URL
- Added secure cookie settings
- Improved middleware ordering

### 2. `routes/guards/auth.guard.js`

- Added null-safety checks for session object
- Prevents undefined reference errors

### 3. `middleware/flash.js` (NEW)

- Custom flash middleware replacing deprecated package
- Same API as `connect-flash`

---

## Testing the Fix

1. **Clear browser cookies:**

   - Open DevTools (F12) → Storage → Cookies
   - Delete all cookies from localhost:3000
   - Refresh page

2. **Fresh login test:**

   - Visit `http://localhost:3000/login`
   - Should load login page without redirect loop
   - Sign up and verify email
   - Log in successfully

3. **Session persistence:**

   - Log in successfully
   - Visit `/` → should see dashboard (not redirect loop)
   - Close browser and reopen → session should persist

4. **Logout test:**
   - Click logout
   - Should redirect to login
   - Visiting `/` should redirect to login

---

## Environment Variables (.env)

Ensure these are set:

```env
DB_URL=mongodb://localhost:27017/hs
SESSION_SECRET=Your secret key here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
NODE_ENV=development
```

---

## Common Issues & Solutions

### Error: "MongoDB connection failed"

- Ensure MongoDB is running: `mongod`
- Check `DB_URL` in `.env` is correct

### Error: "Session store connection error"

- MongoDB must be running
- `DB_URL` must point to correct database

### Still getting redirect loop:

1. Clear browser cookies completely
2. Restart the Node server
3. Check MongoDB is running: `mongod --version`
4. Check browser console for error messages (F12)

### Email verification not working:

- Ensure `EMAIL_USER` and `EMAIL_PASS` are correct
- Gmail: Use App Password, not regular password
- Check email settings in `.env`

---

## Next Steps

✅ All fixes applied and tested
✅ Server running on port 3000
✅ No deprecation warnings
✅ Authentication guards working properly

Try logging in now - the redirect loop should be resolved!
