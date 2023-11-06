import { NextResponse } from 'next/server';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


export async function GET(req: Request, res: Response) {

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID ?? '', serviceAccountAuth);

  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    const rows:GoogleSpreadsheetRow[] = await sheet.getRows();  
    
            
    const headerValues = sheet.headerValues;

    const rawsDataFormatted = rows.map((row) => {
      return row['_rawData'];
    });

    const minRow = rawsDataFormatted.reduce((min: any, row: any) => row[1] < min[1] ? row : min, rawsDataFormatted[0]);

    const formattedResult = headerValues.reduce((acc: Record<string, any>, data: string, index: number) => {
      acc[data] = minRow[index];
      return acc;
    }, {});

    const minRowIndex = minRow[0]-1;
    const rowToUpdate = rows[minRowIndex];
    const rowAppearedValue = rowToUpdate.get('Appeared');

    rowToUpdate.set('Appeared', Number(rowAppearedValue) + 1); 
    await rows[minRowIndex].save();
   
    return NextResponse.json({ message: 'A ok!', data: formattedResult });

    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}