if (process.argv.length !== 4) {
  console.error("You need to supply XML to inject PICURLS into as 1st argument and URL to the *root* of images folder as the 2nd argument.");
  process.exit();
}

const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');

const options_there = {
  ignoreAttributes: false,
  ignoreNameSapce: false,
};
const there = new XMLParser(options_there);
const json = there.parse(
  fs.readFileSync(process.argv[2], 'utf8').replaceAll('<!-->Tokens<\/-->', ''),
);

const { cards } = json.cockatrice_carddatabase;
cards.card.forEach(c => {
  c.set['@_picurl'] = process.argv[3] + '/' + c.set['#text'] + '/' + c.name + '.full.jpg';
  if(c.set.rarity && c.set.rarity === '') {
    c.set.rarity = 'basic';
  }
});

const options_back = {
  format: true,
  ignoreAttributes: false,
}
const back = new XMLBuilder(options_back);

const xml = back.build(json);
console.log(xml);
