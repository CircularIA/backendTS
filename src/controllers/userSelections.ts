import { Request, Response } from 'express';
import UserSelection from '../models/UserSelection';

// Define interfaces para tipar correctamente los parámetros
interface Selections {
    [category: string]: Record<string, any>;
}

interface SaveSelectionsRequest extends Request {
    params: {
        userId: string;
    };
    body: {
        selections: Selections;
    };
}

export const saveSelections = async (req: SaveSelectionsRequest, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { selections } = req.body;

    // Convertir el objeto de selecciones a un formato compatible con Map en Mongoose
    const formattedSelections: Record<string, Map<string, any>> = {};
    Object.keys(selections).forEach(category => {
        formattedSelections[category] = new Map(Object.entries(selections[category]));
    });

    try {
        const updatedSelections = await UserSelection.findOneAndUpdate(
            { userId },
            { $set: { selections: formattedSelections } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedSelections);
    } catch (error) {
        console.error("Error saving selections:", error);
        res.status(500).send(error);
    }
};

export const getSelections = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const selections = await UserSelection.findOne({ userId });
        if (!selections) {
            // Si no hay selecciones, crea un documento vacío y lo devuelve
            const newUserSelections = new UserSelection({ userId, selections: new Map() });
            await newUserSelections.save();
            res.json(newUserSelections);
            return;
        }
        // Convertir Map a objeto para facilitar el manejo en el cliente
        const selectionsObject: Record<string, any> = {};
        if (selections.selections) {
            selections.selections.forEach((value: any, key: string) => {
                selectionsObject[key] = Object.fromEntries(value);
            });
        }
        res.json({ ...selections.toObject(), selections: selectionsObject });
    } catch (error) {
        console.error("Error retrieving selections:", error);
        res.status(500).send(error);
    }
};

export const hasSelections = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
        const selections = await UserSelection.findOne({ userId });
        if (!selections) {
            res.json({ hasSelections: false });
            return;
        }
        res.json({ hasSelections: true });
    } catch (error) {
        console.error("Error checking selections:", error);
        res.status(500).send(error);
    }
};
