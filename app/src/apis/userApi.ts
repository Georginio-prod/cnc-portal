import { BACKEND_URL } from '@/constant/index'

// Define a generic type for user data
import { type User } from '@/types'
import { useToast } from 'vue-toastification'

// Define an interface for UserService
interface UserAPI {
  getUser(address: string): Promise<User>
  createUser(user: User): Promise<User>
  updateUser(updatedUser: Partial<User>): Promise<User>
}

// Implement UserService using Fetch API (or any other HTTP client)
export class FetchUserAPI implements UserAPI {
  async getUser(address: string): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/api/user/${address}`, {
      method: 'GET'
    })
    const userData = await response.json()
    return userData
  }

  async createUser(user: User): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/api/user/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    const createdUser = await response.json() /*{ nonce: `JdqIpQPlVJ0Jyv6yu` }*/
    return createdUser
  }

  async updateUser(updatedUser: Partial<User>): Promise<User> {
    console.log('updatedUser', updatedUser)
    const address = updatedUser.address
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      })
      const updatedUserData = await response.json()
      const $toast = useToast()
      $toast.success('User updated successfully')
      return updatedUserData
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  async getNonce(userId: string): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/api/user/nonce/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resObj = await response.json()

    if (resObj.success) {
      const { nonce } = resObj
      return nonce
    } else {
      throw new Error(resObj.message)
    }
  }
}
