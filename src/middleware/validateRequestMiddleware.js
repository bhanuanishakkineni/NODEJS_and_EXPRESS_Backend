
export const validateRequestMiddleware = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if( !result.success ) {
            // const errorMessages = result.error.errors.map((err) => err.message);
            // const error = errorMessages.join(", ");
            // return res.status(400).json({ message: error});
            const formatted = result.error.format();

            const flatErrors = Object.values(formatted)
                .flat()
                .filter(Boolean)
                .map((err) => err._errors)
                .flat();
            
            return res.status(400).json({ errors: flatErrors });
        }

        next();

    };
};