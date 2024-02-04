const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }

// const asynchand = () => {}
// const asynchand = (fn) => () => {}
// const asynchand = (fn) => async () => {}



// to handle errors we use try catch block or promises(then, catch methods)


// TRY CATCH method
// const asynchand = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }