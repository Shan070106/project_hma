const errorhandler = (err,req,res,next)=> {
    const status = err.status || 500; // Default to 500 Internal Server Error
    res.status(status).json({
        success: false, 
        message : err.message || "Internal Server Error occurred"
    });
}

export {errorhandler};