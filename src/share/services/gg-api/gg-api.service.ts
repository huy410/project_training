import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { join } from 'path';

const scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
const credentialsPath = join(__dirname, './keys/gg-key.json');

@Injectable()
export class GoogleApiService {
  private auth = new google.auth.GoogleAuth({ keyFile: credentialsPath, scopes });

  async createSpreadSheet(data: object[]) {
    const sheetService = google.sheets({ version: 'v4', auth: this.auth });
    const driveService = google.drive({ version: 'v3', auth: this.auth });

    const createdSheet = await sheetService.spreadsheets.create({
      requestBody: { properties: { title: 'Test SpreadSheet' } },
    });
    const fields = Object.keys(data[0]);
    const mappedValues = data.map((item) => Object.values(item));
    const values: string[][] = [fields, ...mappedValues];

    await sheetService.spreadsheets.values.update({
      spreadsheetId: createdSheet.data.spreadsheetId,
      range: 'A1',
      requestBody: { values },
      valueInputOption: 'USER_ENTERED',
    });
    await driveService.permissions.create({
      requestBody: { type: 'anyone', role: 'reader' },
      fileId: createdSheet.data.spreadsheetId,
      fields: 'id',
    });
    return createdSheet.data.spreadsheetUrl;
  }
}
