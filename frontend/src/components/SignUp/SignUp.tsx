import { Button } from "@/components/ui/Button";
import logo from "../../assets/Logo.png";
import { ArrowLeft} from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUp() {
    return (
        <div>
            <header className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-white">
                <Button className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black border-black hover:bg-secondaryColour">
                    <ArrowLeft className="w-8 h-8" />
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                    <img src={logo} alt="Logo" className="h-20 rounded-lg" />
                </div>
            </header>

            <div className="bg-white w-screen pt-32">
                <div className="flex-1 max-w-[100vw] bg-white rounded-t-2xl pb-16">
                    <div className="min-h-screen">
                        <h1 className="p-10 text-4xl space-y-6">
                            Welcome !
                            <p className="mt-4 text-lg text-primaryColour-600">
                                Create a new account
                            </p>
                        </h1>

                        <div className="flex items-center justify-center min-h-1 bg-white">
                        <Card className="w-[350px]">
                                <CardHeader>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">Email</Label>
                                                <Input id="Email" placeholder="Email" />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">Password</Label>
                                                <Input id="Password" placeholder="Password" />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">First Name</Label>
                                                <Input id="FirstName" placeholder="First Name" />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">Last Name</Label>
                                                <Input id="LastName" placeholder="Last Name" />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">Address</Label>
                                                <Input id="Address" placeholder="Street #, Name" />
                                            </div>

                                            <div className="flex w-full items-center gap-4">
                                                <Input id="City" placeholder="City" className="flex-1" />
                                                <Input id="Province" placeholder="Prov" className="flex-1" />
                                                <Input id="Country" placeholder="Country" className="flex-1" />
                                            </div>
    
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <Button className="text-white w-full bg-primaryColour">Sign Up</Button>
                                </CardFooter>
                            </Card>
                        </div>
                        
                        
                    </div>
                </div>
            </div>

        
        </div>
    );
    
}
