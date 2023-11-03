import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library';


export async function GET(req: Request, res: Response) {
  console.log('hello');

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
    console.log({sheet});
    const rows = await sheet.getRows();
    
    
    const raw_data = rows[0]._rawData;
    const header_values = sheet.headerValues;

    const raws_data = rows.map((row) => {
      return row._rawData;
    });


    const results = header_values.map((result, index) => {
      const count = raw_data[index];
      console.log(count);
      return {
        value: result,
        count: count,
      };
    });

    const rawsDataFormatted = raws_data.map(row => row.map((item, index) => index === 1 ? parseInt(item) : item));

    const minRow = rawsDataFormatted.reduce((min, row) => row[1] < min[1] ? row : min, rawsDataFormatted[0]);

    const formattedResult = header_values.reduce((acc: Record<string, any>, data: string, index: number) => {
      acc[data] = minRow[index];
      return acc;
    }, {});

    const minRowIndex = minRow[0]-1;
    const rowToUpdate = rows[minRowIndex];
    const rowAppearedValue = rowToUpdate.get('Appeared');

    rowToUpdate.set('Appeared', Number(rowAppearedValue) + 1); 
    await rows[minRowIndex].save();
   
    return NextResponse.json({ message: 'A ok!', data: formattedResult })

    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}