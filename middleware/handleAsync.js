// wrap an async route in this function so I don't have to keep writing
// try catch blocks. Catch errors and send them to error middleware

export default function handleAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// this is a higher order function - a function that either takes a function
// as an argument or returns a new function - or both.

// handleAsync takes a function then it returns a new function (the express
// route handler.)
