type JwtTokenReceivedPayload = {
    email: string
    iat: number
    exp: number

}


type VerifyAuthTokenBody = {
    error: boolean 
    data: JwtTokenReceivedPayload |null
    err:Error
} 

export type { VerifyAuthTokenBody};