import * as jose from 'jose'

const JWKS = jose.createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
)

export interface GoogleIdTokenPayload {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

export async function verifyGoogleIdToken(
  idToken: string
): Promise<GoogleIdTokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(idToken, JWKS, {
      issuer: ['accounts.google.com', 'https://accounts.google.com'],
      audience: process.env.AUTH_GOOGLE_ID,
    })
    return payload as GoogleIdTokenPayload
  } catch (err) {
    console.error('Google ID token verification failed:', err)
    return null
  }
}
