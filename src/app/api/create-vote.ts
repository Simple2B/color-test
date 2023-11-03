import { GoogleSpreadsheet } from 'google-spreadsheet'

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

export default async function handler(req, res) {
  const {
    query: { id, color }
  } = req;

  try {
    if (!id) {
      throw new Error('Missing id');
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    });
       
    await doc.getInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const rows = await sheet.getRows();

    const rowToUpdate = rows[id-1];
    const rowSelectedValue = rowToUpdate.Selected;
    console.log(rowSelectedValue);

    rowToUpdate.Selected = Number(rowSelectedValue) + 1;
    await rows[id-1].save();

    const outputSheet = doc.sheetsByTitle['Output'];
    const outputRows = await outputSheet.getRows();
    const raw_data = outputRows[0]._rawData;
    const header_values = outputRows[0]._sheet.headerValues;
    console.log(raw_data)

    const selectedColorRaw = raw_data.filter((item, index) => {
      if(item[0]==color){
        return {color: item[0], count: item[1], index: index};
      }
    });   
    console.log(selectedColorRaw);  

    // if(selectedColorRaw.length == 0){
      const colorRowToUpdate = outputRows[selectedColorRaw[0].index];
      
      console.log(colorRowToUpdate);
      // const colorChosenValue = rowToUpdate.Chosen;

      // colorRowToUpdate.Chosen = Number(colorChosenValue) + 1;
      // await outputRows[selectedColorRaw[0].index].save();

    // }else{
    //   const newRaw = [];
    //   newRaw.push(color);
    //   newRaw.push(1);
    //   outputSheet.addRow(newRaw);      
    // }
    
    
    //TODO: add new raw if color didn't exist

    return res.json({ message: 'A ok!'});

  } catch (error) {
    res.status(500).json(error);
  }
}