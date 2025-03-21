import { MercadoPagoConfig, OAuth } from 'mercadopago'

export const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

const api = {
  user: {
    async authorize() {
      // Determinar la URL de redirección según el entorno
      const redirectUri = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/mercadopago/callback'
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`;

      const url = new OAuth(mercadopago).getAuthorizationURL({
        options: {
          client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID,
          redirect_uri: redirectUri
        }
      })
      return url
    },
    async connect(code: string) {
      // Determinar la URL de redirección según el entorno
      const redirectUri = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/mercadopago/callback'
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`;

      const credentials = await new OAuth(mercadopago).create({
        body: {
          client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID,
          client_secret: process.env.MP_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri
        }
      })
      return credentials
    },
    async update() {}
  }
}

export default api
