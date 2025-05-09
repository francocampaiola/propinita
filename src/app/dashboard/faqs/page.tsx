import {
  AccordionIcon,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
  Box,
  Divider
} from '@chakra-ui/react'
import React from 'react'

const FaqsPage = () => {
  return (
    <Flex
      backgroundColor='gray.1000'
      borderRadius='15px'
      direction={'column'}
      justifyContent='space-between'
    >
      <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
        <Text fontWeight={700}>Mi perfil</Text>
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} mx={4} mt={4} mb={4} direction='column' gap={4}>
        <Accordion allowToggle>
          <Flex direction={'row'} gap={8} alignItems={'center'}>
            <Flex direction={'column'} gap={4} flex={1}>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Qué es propinita y cómo funciona?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Propinita es una plataforma que te permite recibir propinas digitales de manera
                  rápida y sencilla. Creás tu cuenta, la vinculás con MercadoPago y compartís tu
                  enlace o código QR para empezar a recibir aportes.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cómo puedo registrarme en propinita?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Solo necesitás un correo electrónico y una cuenta de MercadoPago. Completás un
                  breve formulario, aceptás los términos y condiciones ¡y listo! Ya podés empezar a
                  recibir propinas.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cómo vinculo mi cuenta de MercadoPago a propinita?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Durante el proceso de registro o desde tu perfil, seleccioná Vincular cuenta de
                  MercadoPago, iniciá sesión con tu usuario de MercadoPago y autorizá la conexión.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cuáles son las comisiones por usar propinita?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Propinita cobra una pequeña comisión por cada transacción recibida, que se
                  descuenta automáticamente del monto de la propina. Además, MercadoPago puede
                  aplicar sus propias tarifas.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cómo puedo recibir propinas a través de propinita?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Una vez creada tu cuenta, obtenés un código QR que podés compartir donde quieras:
                  redes sociales, streams, eventos, etc. Quien quiera apoyarte solo necesita hacer
                  clic o escanear y elegir el monto.
                </AccordionPanel>
              </AccordionItem>
            </Flex>
            <Flex direction={'column'} gap={4} flex={1}>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cómo puedo generar un código QR para recibir propinas?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Ingresá a tu perfil y hacé clic en “Generar QR”. Hacé una captura de pantalla o
                  compartilo directamente desde ahí para que las personas puedan escanearlo y
                  enviarte propinas.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Qué debo hacer si tengo problemas para recibir una propina?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Revisá que tu cuenta esté correctamente vinculada a MercadoPago. Si el problema
                  persiste, podés contactarnos a ayuda@propinita.app con los detalles del caso.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Es seguro usar propinita para recibir pagos?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Sí. Utilizamos la infraestructura de MercadoPago para procesar los pagos, lo que
                  garantiza seguridad y confianza en cada transacción.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Cómo puedo retirar el dinero recibido en propinas?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  El dinero se transfiere automáticamente a tu cuenta de MercadoPago. Desde allí
                  podés retirarlo a tu cuenta bancaria o usarlo como prefieras.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border='0'>
                <h2>
                  <AccordionButton _hover={{ bg: 'transparent' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      ¿Puedo usar propinita si no tengo una cuenta de MercadoPago?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  No, actualmente es necesario tener una cuenta activa de MercadoPago para poder
                  recibir y gestionar las propinas a través de Propinita.
                </AccordionPanel>
              </AccordionItem>
            </Flex>
          </Flex>
        </Accordion>
      </Flex>
    </Flex>
  )
}

export default FaqsPage
