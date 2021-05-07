import { getRepository } from 'typeorm'
import User from '@module/users/infra/typeorm/entities/User'
import { hash } from 'bcryptjs'
import AppError from '@shared/errors/AppError'

interface Request {
    name: string
    email: string
    password: string
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User)

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        })

        if (checkUserExists) {
            throw new AppError('Email address already used.')
        }

        const pashedPassword = await hash(password, 8)
        
        const user = usersRepository.create({
            name,
            email,
            password: pashedPassword,
        })

        await usersRepository.save(user)

        return user
    }
}

export default CreateUserService