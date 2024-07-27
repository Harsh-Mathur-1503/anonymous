"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  
  return (
    <>
      Not signed in <br />
      <button className="bg-teal-50 text-black p-2 m-2 rounded-md" onClick={() => signIn()}>Sign in</button>
      <button className="bg-blue-500 text-white p-2 m-2 rounded-md" onClick={() => signIn('google')}>Sign in with Google</button>
    </>
  )
}
