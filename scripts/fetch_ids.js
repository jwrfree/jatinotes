const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: '0fd6j2sl',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: 'skXkOr4kLRbYWKul1XUEl1WnCjPiGmy9X79QiTdKYMOuiAsOAxC7uim03UPQbJlQtKGyomiEzQpyQ2BfEfEmEvUtZkuIP0hE1oBQ5d9eKBQ6tOCBrADPWriNbTYH5fuInQF7MNUAf1dHhObD2zGRY0uihoSW9fH6ZZpkqxQGqYtaOCOW7BZ3'
});

async function main() {
    const data = await client.fetch(`*[_type in ["category", "author"]] { _id, _type, title, name }`);
    console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
