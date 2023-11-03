import { NextResponse } from 'next/server';
import { NextApiRequest } from "next";
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library';

export async function GET(req: NextApiRequest, res: Response) {
  const params = new URLSearchParams(req.url?.split("?")?.[1]);
  const id = params.get('id');
  const color = params.get('color');

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID ?? '',serviceAccountAuth);

  try {
    if (!id || !color) {
      throw new Error('Missing id');
    }
       
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const rows = await sheet.getRows();

    const rowToUpdate = rows[parseInt(id)-1];
    const rowSelectedValue = rowToUpdate.get('Selected');
    
    rowToUpdate.set('Selected', Number(rowSelectedValue) + 1); 
    await rows[parseInt(id)-1].save();

    const outputSheet = doc.sheetsByTitle['Output'];
    const outputRows = await outputSheet.getRows();

    const selectedColorRaw = outputRows.filter((row) => {
      if(row.get('Color') === color){
        console.log(row);
        row.set('Chosen', Number(row.get('Chosen')) + 1);
        row.save();
        return true;
      }        
    });

    if(selectedColorRaw.length === 0) {
      const newRaw = await outputSheet.addRow({
        Color: color,
        Chosen: 1,
      });
      newRaw.save();
    }

    return NextResponse.json({ message: 'A ok!'});

  } catch (error) {
    NextResponse.json(error);
  }
}