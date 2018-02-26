echo "Building for Development"

npm install
set -e
npm run lint
npm run firebase
npm i firebase-tools
firebase deploy --public="public" --project="dev-usecases" --token=$FIREBASE_TOKEN
