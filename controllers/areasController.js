import * as areasService from "../services/areasService.js";

export const getAreas = async (req, res, next) => {
    try {
        const areas = await areasService.getAllAreas();
        res.json(areas);
    } catch (error) {
        next(error);
    }
};
