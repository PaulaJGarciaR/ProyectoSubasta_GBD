export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: "Validation failed",
            fields: error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }
};