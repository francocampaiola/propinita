import { MercadoPagoConfig, OAuth } from 'mercadopago'

export const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

const api = {
  user: {
    async authorize() {
      const url = new OAuth(mercadopago).getAuthorizationURL({
        options: {
          client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/connect`
        }
      })
      return url
    },
    async connect(code: string) {
      const credentials = await new OAuth(mercadopago).create({
        body: {
          client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID,
          client_secret: process.env.MP_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/connect`
        }
      })
      return credentials
    },
    async update() {}
  }
}

export default api