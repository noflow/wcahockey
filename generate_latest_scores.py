import json
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SHEET_ID = '1iRjtMzf2W_bPmdths3KARDFowKXfNZjoCeY2yZBGUW8'
RANGE = 'Game Log!A2:R'

# Load credentials
creds = Credentials.from_service_account_file('google_credentials.json', scopes=SCOPES)
service = build('sheets', 'v4', credentials=creds)

# Read sheet data
result = service.spreadsheets().values().get(spreadsheetId=SHEET_ID, range=RANGE).execute()
rows = result.get('values', [])

# Filter out incomplete rows
games = [r for r in rows if len(r) > 10 and r[3] and r[6] and r[8] and r[10]]  # note: r[8] is now Team 2 Name

# Last 8 games
last_20 = games[-20:]

def logo(name):
    return f"images/ticker/{name.lower().replace(' ', '_')}.png"

# Build JSON structure
output = []
for row in last_20:
    game = {
        "date": row[1],
        "team1": {
            "name": row[3],
            "score": row[5],
            "logo": logo(row[3])
        },
        "team2": {
            "name": row[8],  # changed from row[9]
            "score": row[10],
            "logo": logo(row[8])
        }
    }
    output.append(game)

# Write to file
with open("latest_scores.json", "w") as f:
    json.dump(output, f, indent=2)

print("✅ latest_scores.json updated with last 20 games.")
