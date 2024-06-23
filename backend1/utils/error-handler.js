export const errorHandler = (err, req, res, next) => {
    console.error("Global error handler:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
};