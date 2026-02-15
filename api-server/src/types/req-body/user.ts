
export type createNewUserBody = {
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}

export type UserLoginBody = {
    email: string,
    password: string
}


