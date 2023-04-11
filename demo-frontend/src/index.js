const { default: Keycloak } = require('keycloak-js')
const msal = require('@azure/msal-node')

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'demo',
    clientId: 'demo-frontend'
});

keycloak.init({
    checkLoginIframe: false,
    enableLogging: true,
    pkceMethod: "S256"
}).then(function(authenticated) {

}).catch(function(e) {
    console.log(e);
});
keycloak.onAuthSuccess = function() {
    document.getElementById('unauthenticated').style = 'display: none';
    document.getElementById('authenticated').style = '';

    keycloak.loadUserProfile().then(function(profile) {
        document.getElementById('jwt').innerText = keycloak.token
        document.getElementById('az-login').innerText = `az login --service-principal -u ${keycloak.tokenParsed.AZURE_CLIENT_ID} -t ${keycloak.tokenParsed.AZURE_TENANT_ID} --federated-token ${keycloak.token}`

        // https://github.com/Azure/azure-workload-identity/blob/main/examples/msal-node/index.js
        //const cred = new msal.ClientAssertionCredential(window.AZURE_TENANT_ID, window.AZURE_CLIENT_ID, console.log)
        const app = new msal.ConfidentialClientApplication({
            auth: {
                clientId: window.AZURE_CLIENT_ID,
                authority: `https://login.microsoftonline.com/${window.AZURE_TENANT_ID}`,
                clientAssertion: keycloak.token,
            }
        })
        app.acquireTokenByClientCredential({ scopes: [] })
            .then(token => console.log(token))
            .catch(error => console.log(error))
    }).catch(function(e) {
        console.log(e);
    });
}
document.getElementById('keycloak-login').onclick = keycloak.login;
