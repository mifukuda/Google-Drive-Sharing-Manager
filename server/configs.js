const port = 4000
const base_URL = `http://localhost:${port}`

module.exports = {
    port: port,
    base_URL: base_URL,
    JWT_secret: 'jwt-secret',
    oauth_credentials:{
        client_id:"612406860479-rj9luu4mfosm7qfikets5bunsfencbeu.apps.googleusercontent.com",
        project_id:"drive-sharing-manager-365006",
        auth_uri:"https://accounts.google.com/o/oauth2/auth",
        token_uri:"https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
        client_secret:"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",
        redirect_uris:[`${base_URL}/auth/callback`],
        scopes: ["https://www.googleapis.com/auth/drive"]
    }
}
