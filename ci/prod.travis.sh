echo "Building for Production"
git config --global user.email "stefano.antonel@epfl.ch"
git config --global user.name "Stefano Antonel"
git remote rm origin
git remote add origin https://antonelepfl:${GH_TOKEN}@github.com/antonelepfl/usecases.git
npm install
set -e
npm run lint
npm run ghpages
git checkout -b gh-pages
cp -R ./docs/* ./ && rm -R docs/
git add --all
git commit -m "Deploy form travis"
git push origin gh-pages --force
