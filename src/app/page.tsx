import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SignOut from "./components/SignOut";
import { Flex, Text } from "@chakra-ui/react";

export default async function Home() {

  const cookieStore = cookies();
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  } else {
    redirect('/dashboard')
  }

  return (
    <Flex direction={'column'}>
      <Text textAlign={'center'}>Pantalla de bienvenida a Propinita</Text>
      <SignOut />
    </Flex>
  );
}
