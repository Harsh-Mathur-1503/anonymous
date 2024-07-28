"use client"
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const toast = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                verifyCode: data.verifyCode
            })
            toast.toast({
                title: 'Account verified',
                variant: 'default',
                description: response.data.message,
            })
            router.replace('sign-in')
        } catch (error) {
            console.error("Error in sign-up", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.toast({
                title: "An error occurred",
                variant: "destructive",
                description: axiosError.response?.data.message ?? "An error occurred while signing up",
            });
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-4xl font-extrabold tracking-light lg:text-5xl mb-6'>
                    Verify Your Account
                </h1>
                <p className='mb-4'>
                    Enter the verification code sent to your email address.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter code" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the code sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
