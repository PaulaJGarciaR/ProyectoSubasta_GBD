export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // Retorna un array de strings para que sea compatible con tu componente React
        return res.status(400).json(
            error.issues.map(issue => issue.message)
        );
    }
};