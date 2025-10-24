import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Models
import BranchModel from '../models/Branches';
import ListInputDatsModel from '../models/ListInputDats';
import UserSelection from '../models/UserSelection';
import IndicatorModel from '../models/Indicators';
import InputDatsModel from '../models/InputDats';

export const getListInputDats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branch } = req.params;
        if (branch) {
            const listInputDats = await BranchModel.findById(branch).populate(
                'inputDats'
            );
            res.status(200).json(listInputDats);
            return;
        } else {
            const listInputDats = await ListInputDatsModel.find();
            res.status(200).json(listInputDats);
            return;
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
        return;
    }
};

export const createListInputDat = async (req: Request, res: Response): Promise<void> => {
    try {
        const listInputDat = req.body;
        const listInputDatExist = await ListInputDatsModel.findOne({
            name: listInputDat.name,
        });
        
        if (listInputDatExist) {
            res.status(409).json({ message: 'List Input Dat already exist' });
            return;
        }
        
        const newListInputDat = new ListInputDatsModel(listInputDat);
        newListInputDat._id = new mongoose.Types.ObjectId();
        await newListInputDat.save();
        
        res.status(201).json(newListInputDat);
        return;
    } catch (error) {
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({ message: (error as Error).message });
        } else {
            res.status(409).json({ message: (error as Error).message });
        }
        return;
    }
};

export const updateListInputDat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const listInputDat = await ListInputDatsModel.findByIdAndUpdate(id, req.body);
        
        if (!listInputDat) {
            res.status(400).send({ message: 'List Input Dat not found' });
            return;
        }
                
        res.status(200).send({ listInputDat });
        return;
    } catch (error) {
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({ message: (error as Error).message });
        } else {
            res.status(409).json({ message: (error as Error).message });
        }
        return;
    }
};

export const deleteListInputDat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const listInputDat = await ListInputDatsModel.findByIdAndDelete(id);
        
        if (!listInputDat) {
            res.status(400).send({ message: 'List Input Dat not found' });
            return;
        }
                
        res.status(200).send({ listInputDat });
        return;
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
        return;
    }
};

export const getListInputDatsByIndicator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { indicatorId } = req.params;
        console.log(indicatorId);
        
        const indicator = await IndicatorModel.findById(indicatorId);
        console.log(indicator);
        
        if (!indicator) {
            res.status(400).send({ message: 'Indicator not found' });
            return;
        }
            
        const listInputDats = await ListInputDatsModel.find({
            _id: { $in: indicator.inputDats },
        });
        
        console.log(listInputDats.length);
        res.status(200).json(listInputDats);
        return;
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
        return;
    }
};

export const getEcoequivalences = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subcategory, year, branch } = req.query;
        
        if (!branch) {
            res.status(400).json({ message: 'Branch is required' });
            return;
        }

        console.log("LOG DE DEPURACION", subcategory, year, branch);

        const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
        const startDate = new Date(targetYear, 0, 1); // 1 de enero del año
        const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999); // 31 de diciembre del año
        
        const filter: { subcategory: string } = {
            subcategory: (subcategory as string) || 'Salida de materiales'
        };
        
        const listInputDats = await ListInputDatsModel.find(filter);
        
        if (!listInputDats.length) {
            res.status(200).json({ 
                message: 'No se encontraron indicadores para la subcategoría especificada',
                data: []
            });
            return;
        }
        
        const listInputDatIds = listInputDats.map(item => item._id);
        
        const inputDats = await InputDatsModel.find({
            listInputDat: { $in: listInputDatIds },
            branch: branch,
            date: { $gte: startDate, $lte: endDate }
        });
        
        const sumByListInputDat: { [key: string]: number } = {};
        inputDats.forEach(inputDat => {
            const listInputDatId = inputDat.listInputDat.toString();
            if (!sumByListInputDat[listInputDatId]) {
                sumByListInputDat[listInputDatId] = 0;
            }
            sumByListInputDat[listInputDatId] += inputDat.value;
        });
        
        const totalEcoequivalences = {
            co2: 0,
            agua: 0,
            arboles: 0,
            energia: 0
        };
        
        for (const listInputDat of listInputDats) {
            const listInputDatId = listInputDat._id.toString();
            const sum = sumByListInputDat[listInputDatId] || 0;
            
            
            totalEcoequivalences.co2 += sum * (listInputDat.ecoequivalence?.co2 || 0);
            totalEcoequivalences.agua += sum * (listInputDat.ecoequivalence?.agua || 0);
            totalEcoequivalences.arboles += sum * (listInputDat.ecoequivalence?.arboles || 0);
            totalEcoequivalences.energia += sum * (listInputDat.ecoequivalence?.energia || 0);
        }
        
        const detailedResponse = {
            year: targetYear,
            subcategory: filter.subcategory,
            indicators: listInputDats.map(item => ({
                name: item.name,
                ecoequivalence: item.ecoequivalence,
                totalValue: sumByListInputDat[item._id.toString()] || 0,
                calculatedEcoequivalences: {
                    co2: (sumByListInputDat[item._id.toString()] || 0) * (item.ecoequivalence?.co2 || 0),
                    agua: (sumByListInputDat[item._id.toString()] || 0) * (item.ecoequivalence?.agua || 0),
                    arboles: (sumByListInputDat[item._id.toString()] || 0) * (item.ecoequivalence?.arboles || 0),
                    energia: (sumByListInputDat[item._id.toString()] || 0) * (item.ecoequivalence?.energia || 0)
                }
            })),
            ecoequivalences: totalEcoequivalences
        };
        
        res.status(200).json(detailedResponse);
        return;
    } catch (error) {
        console.error('Error al calcular ecoequivalencias:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: (error as Error).message });
        return;
    }
};

export const generateExcelTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branchId, userId } = req.params;
        // Obtener el año del query parameter, o usar el año actual si no se proporciona
        const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
        
        // Obtener la sucursal
        const branch = await BranchModel.findById(branchId);
        if (!branch) {
            res.status(404).json({ message: 'Sucursal no encontrada' });
            return;
        }
        
        // Obtener las selecciones del usuario
        const userSelections = await UserSelection.findOne({ userId });
        if (!userSelections || !userSelections.selections) {
            res.status(404).json({ message: 'No se encontraron selecciones para este usuario' });
            return;
        }
        
        // Extraer los IDs de los indicadores seleccionados
        const selectedIndicatorIds: string[] = [];
        userSelections.selections.forEach((categoryMap: any, category: string) => {
            if (categoryMap instanceof Map) {
                categoryMap.forEach((indicatorData: any, indicatorId: string) => {
                    selectedIndicatorIds.push(indicatorId);
                });
            }
        });
        
        if (selectedIndicatorIds.length === 0) {
            res.status(404).json({ message: 'No se encontraron indicadores seleccionados' });
            return;
        }
        
        // Obtener los datos de entrada disponibles para la sucursal que coincidan con las selecciones del usuario
        const branchInputDats = branch.inputDats;
        // Encontrar la intersección entre los indicadores de la sucursal y los seleccionados por el usuario
        const filteredIds = branchInputDats.filter((id: mongoose.Types.ObjectId) => 
            selectedIndicatorIds.includes(id.toString())
        );
        
        const listInputDats = await ListInputDatsModel.find({
            _id: { $in: filteredIds }
        });
        
        if (!listInputDats.length) {
            res.status(404).json({ message: 'No se encontraron datos de entrada para las selecciones de este usuario' });
            return;
        }
        
        // Crear un nuevo libro de Excel
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'CircularIA';
        workbook.lastModifiedBy = 'CircularIA';
        workbook.created = new Date();
        workbook.modified = new Date();
        
        // Añadir propiedades personalizadas
        workbook.properties.date1904 = false;
        
        // Crear hoja de trabajo con nombre personalizado
        const worksheet = workbook.addWorksheet('Datos de Entrada', {
            properties: {
                tabColor: { argb: '00A651' } // Color verde similar al de la interfaz
            },
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'portrait',
                fitToPage: true
            }
        });
        
        // Definir las columnas manualmente para asegurar que se muestren correctamente
        worksheet.columns = [
            { header: 'NOMBRE INDICADOR', key: 'name', width: 40 },
            { header: 'UNIDAD', key: 'measurement', width: 15 },
            { header: 'Enero', key: 'enero', width: 15 },
            { header: 'Febrero', key: 'febrero', width: 15 },
            { header: 'Marzo', key: 'marzo', width: 15 },
            { header: 'Abril', key: 'abril', width: 15 },
            { header: 'Mayo', key: 'mayo', width: 15 },
            { header: 'Junio', key: 'junio', width: 15 },
            { header: 'Julio', key: 'julio', width: 15 },
            { header: 'Agosto', key: 'agosto', width: 15 },
            { header: 'Septiembre', key: 'septiembre', width: 15 },
            { header: 'Octubre', key: 'octubre', width: 15 },
            { header: 'Noviembre', key: 'noviembre', width: 15 },
            { header: 'Diciembre', key: 'diciembre', width: 15 }
        ];
        
        // Añadir título y logo (simulado con texto)
        worksheet.mergeCells('A1:N1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = `CircularIA - Plantilla Personalizada de Datos de Entrada - ${branch.name || 'Sucursal'}`;
        titleCell.font = {
            name: 'Arial',
            size: 16,
            bold: true,
            color: { argb: '00A651' } // Verde
        };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 30;
        
        // Añadir instrucciones
        worksheet.mergeCells('A2:N2');
        const instructionCell = worksheet.getCell('A2');
        instructionCell.value = 'Descarga la plantilla para rellenar los datos correctamente';
        instructionCell.font = {
            name: 'Arial',
            size: 11,
            italic: true
        };
        instructionCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).height = 20;
        
        // Añadir año
        worksheet.mergeCells('A3:N3');
        const yearCell = worksheet.getCell('A3');
        yearCell.value = `Año: ${year}`;
        yearCell.font = {
            name: 'Arial',
            size: 12,
            bold: true
        };
        yearCell.alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getRow(3).height = 20;
        
        // Espacio adicional antes de la tabla
        worksheet.mergeCells('A4:N4');
        worksheet.getRow(4).height = 10;
        
        // Asegurarnos de que los encabezados se muestren correctamente
        // Estilo para los encabezados de la tabla (fila 5)
        const headerRow = worksheet.getRow(5);
        
        // Establecer explícitamente los valores de los encabezados
        headerRow.getCell(1).value = 'NOMBRE INDICADOR';
        headerRow.getCell(2).value = 'UNIDAD';
        headerRow.getCell(3).value = 'Enero';
        headerRow.getCell(4).value = 'Febrero';
        headerRow.getCell(5).value = 'Marzo';
        headerRow.getCell(6).value = 'Abril';
        headerRow.getCell(7).value = 'Mayo';
        headerRow.getCell(8).value = 'Junio';
        headerRow.getCell(9).value = 'Julio';
        headerRow.getCell(10).value = 'Agosto';
        headerRow.getCell(11).value = 'Septiembre';
        headerRow.getCell(12).value = 'Octubre';
        headerRow.getCell(13).value = 'Noviembre';
        headerRow.getCell(14).value = 'Diciembre';
        headerRow.height = 25;
        headerRow.eachCell((cell: any, colNumber: number) => {
            cell.font = {
                name: 'Arial',
                size: 12,
                bold: true,
                color: { argb: 'FFFFFF' } // Texto blanco
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00A651' } // Fondo verde
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFFFFF' } },
                left: { style: 'thin', color: { argb: 'FFFFFF' } },
                bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
                right: { style: 'thin', color: { argb: 'FFFFFF' } }
            };
        });
        
        // Agregar los datos de entrada como filas
        let rowIndex = 6; // Comenzamos después del encabezado
        
        // Agrupar por categoría
        const groupedByCategory = listInputDats.reduce((acc, inputDat) => {
            const category = inputDat.category || 'Sin categoría';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(inputDat);
            return acc;
        }, {} as Record<string, any[]>);
        
        // Iterar por categorías
        for (const [category, items] of Object.entries(groupedByCategory)) {
            // Añadir fila de categoría
            const categoryRow = worksheet.getRow(rowIndex);
            worksheet.mergeCells(`A${rowIndex}:N${rowIndex}`);
            const categoryCell = worksheet.getCell(`A${rowIndex}`);
            categoryCell.value = category;
            categoryCell.font = {
                name: 'Arial',
                size: 12,
                bold: true,
                color: { argb: '00A651' } // Verde
            };
            categoryCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E6F4EA' } // Verde claro
            };
            categoryCell.alignment = { vertical: 'middle', horizontal: 'left' };
            categoryRow.height = 20;
            rowIndex++;
            
            // Añadir items de esta categoría
            items.forEach((inputDat) => {
                const dataRow = worksheet.getRow(rowIndex);
                dataRow.getCell(1).value = inputDat.name;
                dataRow.getCell(2).value = inputDat.measurement || '';
                
                // Añadir celdas vacías para los meses (columnas 3-14)
                for (let i = 3; i <= 14; i++) {
                    dataRow.getCell(i).value = '';
                }
                
                // Estilo para filas de datos
                dataRow.height = 20;
                dataRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                    // Estilo alternado para filas
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: rowIndex % 2 === 0 ? 'F5F5F5' : 'FFFFFF' } // Gris claro/blanco alternado
                    };
                    
                    // Alineación según columna
                    if (colNumber === 1) {
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    } else {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                    
                    // Bordes
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'D0D0D0' } },
                        left: { style: 'thin', color: { argb: 'D0D0D0' } },
                        bottom: { style: 'thin', color: { argb: 'D0D0D0' } },
                        right: { style: 'thin', color: { argb: 'D0D0D0' } }
                    };
                });
                
                rowIndex++;
            });
            
            // Espacio después de cada categoría
            const spacerRow = worksheet.getRow(rowIndex);
            spacerRow.height = 5;
            rowIndex++;
        }
        
        // Añadir pie de página
        const footerRowIndex = rowIndex + 1;
        worksheet.mergeCells(`A${footerRowIndex}:N${footerRowIndex}`);
        const footerCell = worksheet.getCell(`A${footerRowIndex}`);
        footerCell.value = `© ${new Date().getFullYear()} CircularIA - Generado el ${new Date().toLocaleDateString()}`;
        footerCell.font = {
            name: 'Arial',
            size: 10,
            italic: true,
            color: { argb: '808080' } // Gris
        };
        footerCell.alignment = { vertical: 'middle', horizontal: 'center' };
        
        // Proteger ciertas celdas (solo las de los meses serán editables)
        worksheet.protect('circularIA', {
            selectLockedCells: true,
            selectUnlockedCells: true,
            formatCells: true,
            formatColumns: true,
            formatRows: true,
            insertColumns: false,
            insertRows: false,
            insertHyperlinks: false,
            deleteColumns: false,
            deleteRows: false,
            sort: false,
            autoFilter: false,
            pivotTables: false
        });
        
        // Bloquear las celdas de nombre y unidad, pero permitir editar los valores mensuales
        worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: number) => {
            if (rowNumber >= 6) { // Solo para filas de datos
                row.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                    if (colNumber <= 2) { // Nombre y unidad
                        cell.protection = { locked: true };
                    } else { // Valores mensuales
                        cell.protection = { locked: false };
                        // Añadir un color de fondo más claro para indicar que son editables
                        if (cell.fill && cell.fill.fgColor) {
                            const currentColor = cell.fill.fgColor.argb || 'FFFFFF';
                            // Aclarar ligeramente el color existente para indicar que es editable
                            if (currentColor === 'FFFFFF') {
                                cell.fill.fgColor.argb = 'FFFFE0'; // Amarillo muy claro
                            } else if (currentColor === 'F5F5F5') {
                                cell.fill.fgColor.argb = 'F5F5E0'; // Gris amarillento claro
                            }
                        }
                    }
                });
            }
        });
        
        // Establecer el tipo de contenido para la respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=datos_entrada_${branchId}_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        // Escribir el libro de Excel en la respuesta
        await workbook.xlsx.write(res);
        
        // Finalizar la respuesta
        res.end();
    } catch (error) {
        console.error('Error al generar la plantilla Excel:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: (error as Error).message });
        return;
    }
};