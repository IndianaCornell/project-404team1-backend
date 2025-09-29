import Area from "../models/area.js";

export const getAllAreas= async () => {
    return await Area.findAll({
        order: [['name', 'ASC']]
    });
};
