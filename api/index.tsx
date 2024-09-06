import { Button, Frog, TextInput } from 'frog'
import { Box, Heading, Text, VStack, HStack, Image, vars } from './ui.js'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import maci from "maci-domainobjs";
import { handle } from 'frog/vercel'
import  { maciAbi } from "./maciAbi.js"
import  { pollAbi } from "./pollAbi.js"
import meme1 from "./meme1.jpg"
import meme2 from "./meme2.png"
import meme3 from "./meme3.jpeg"

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }


export const app = new Frog({
  ui: {vars},
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: 'MACI Frame',
})

app.frame('/', (c) => {
  return c.res({
    action:'/meme',
    image: (
        <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        padding="128"
      >
        <VStack gap="4">
          <Heading align='center'>MEME Contest 🗳️</Heading>
          <Text color="text200" align='center'  size="20">
            A MACI Frame
          </Text>
        </VStack>
      </Box>
    ),
    intents: [
        <TextInput placeholder="Enter MACI public key..." />,
        <Button.Transaction target="/signup">Sign Up</Button.Transaction>,
        <Button.Link href="google.com">Already Signed?</Button.Link>,
    ],
  })
})

app.frame('/meme', (c) => {
    return c.res({
      image: (
        <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
      >
        <HStack gap="8" grow alignVertical='center'>
           <Image src={meme1} width="256" borderRadius="10"/>
           <Image src={meme3} width="256" borderRadius="10"/>
            {/* <Box backgroundColor="red" height="100%" />
            <Box backgroundColor="red" height="100%" /> */}

        </HStack>
        <Text align='center' size="16" weight='200'>
                *Voting again will replace your previous vote.
            </Text>
        </Box>
      ),
      intents: [
        <TextInput placeholder="Enter MACI private key..." />,
        <Button value="0">Vote A</Button>,
        <Button value="1">Vote B</Button>,
      ],
    })
  })

  app.transaction('/signup', (c) => {
    const { inputText } = c
    //check if valid maci
    console.log(maciAbi);
    const macikey = maci.PubKey.deserialize(inputText).asContractParam();
    // Contract transaction response.
    return c.contract({
      abi: maciAbi,
      chainId: 'eip155:11155420',
      functionName: 'signUp',
      args: [{x:macikey.x,y:macikey.y}, "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
      to: '0xea7cb3c0365dc62b2e9d2ec84ecfdddd802294d3',
    })
  })

//TODO:
//   app.transaction('/publish', (c) => {
//     const { buttonValue, inputText } = c

//     //check if valid maci
//     const userMaciPrivKey =  maci.PrivKey.deserialize(inputText);
//     const userMaciPubKey = userMaciPrivKey.genPubKey();
//     const command = new maci.PCommand(stateIndex, userMaciPubKey, voteOptionIndex, newVoteWeight, nonce, BigInt(pollId), userSalt);
//     console.log(inputText)
//     // Contract transaction response.
//     return c.contract({
//       pollAbi,
//       chainId: 'eip155:11155420',
//       functionName: 'signUp',
//       args: [{x:macikey.x,y:macikey.y}, "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
//       to: '0xea7cb3c0365dc62b2e9d2ec84ecfdddd802294d3',
//     })
//   })

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// 0x4Cda5028ebB908D661De76021BDcfF4f6A2F3850 poll
// const { stateIndex: index, voiceCredits } = await signup({
//     maciPubKey,
//     maciAddress: config.maciAddress!,
//     sgDataArg: sgData,
//     signer,
//   });

// state index = 1 , nonce  = 0,
//     const userSalt = salt ? BigInt(salt) : (0, maci_crypto_1.genRandomSalt)();
//poll id 2
//  const treeDepths = await pollContract.treeDepths();
//   const coordinatorPubKeyResult = await pollContract.coordinatorPubKey();
// const maxVoteOptions = Number(BigInt(maci_core_1.MESSAGE_TREE_ARITY) ** treeDepths.voteOptionTreeDepth);
