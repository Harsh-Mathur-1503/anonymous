'use client';

import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 py-12 bg-gray-100 text-gray-800">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className="relative w-full max-w-md md:max-w-lg">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-white shadow-md rounded-lg">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-700">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 p-4">
                      <Mail className="text-3xl text-gray-500" />
                      <div className="flex-grow">
                        <p className="text-base text-gray-800">{message.content}</p>
                        <p className="text-sm text-gray-500">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-gray-300">
        <p className="text-sm">
          © 2024 Anonymous Feedback. All rights reserved.
        </p>
      </footer>
    </>
  );
}
