var crypto = require('crypto');
/*var cipher = crypto.createCipheriv('aes-128-cbc', "posist-open-apis", "@@@@&&&&####$$$$");
do{
	var random = crypto.randomBytes(8).toString('utf8');
	var customer_key = cipher.update(random+':'+'58df87c4f17b2be431d6e571', 'utf8', 'hex')+cipher.final('hex');
}while(random.indexOf(':')>-1)

console.log(customer_key);*/

var customer_key = [
	"f72cc9cc07c17461bcacf3723365ac632a4d1aacceca732bd8b9e4b6cb440d21911e52d1da58f076a8e0cdd10084db7b",
	"b65ba57076766deb44f8bad982dd3b1bcca0bd71cc508884e512787a6d4cf56ea7704e18b6c64cdbf2bde14b69f19d17",
	"b0ab5643024a462c9534a568993e5824374ccc51031f6c857dbf19ae0504ec5a5a76304c159565213945e6684079b1a5",
	"fc5a855dab449198249f887f5708b4aa534148e3bc826bb7d30ab194a798e7dc35db25b911d2fde24b7155886375c684",
	"b2a8f43184b0770a72c34a877f52620c9739428cc8f0aaeedd4381e66900af7400c5f1bb5c04aab958d48d2f1b61ebdc",
	"d94b2bca369362276a16544f64ba7e6967942f3bc172734882abf86ce183d4cc4e3a7f9ee5a63c60d28d6439036a8d26",
	"9f92d28d1120f6c06d43a6a491acf2d0373c4630fd01b3f9097b65c5845f58ccbb1adb7a8ff479e419a2dce4f6c8b263",
	"779d52ec2bb020d0954af5e3aab28d5e06c9bef16261152c62770d8d3aafa85c8531eacd5c3700db390ea67e8404ea8e",
	"a641dbd0b910ab37f897fa5d86d9eff18eb2f62fbe0bc5ceec6cb57788309e607a7885d3a6693ca6d1adbfecfb98e7c3",
	"fd7c0101f9e6be49648d5355ba668c9819ab6a1ac72112169a647fd1ebce675ba81a4cb812be42443cf041c979949272",
	"168aa2755a5065149a9d688e1dd4b7dbc02b34466cc83ee20b1887d682ab1833792613a83e6cc36f6215b453646c1f71",
	"ff4b6398bb07ddda70f27a66ace5b70e01b40615012fb5336bf2e6c19c8a2441366ab5555711968183865c7563dbe1cb",
	"8e47504048dd758b1847a69618d45c9fb0bd0abe18d724e67ee97d735c841f14dbf1dd6088d57d6025250bea0255219f",
	"5cbe67832a072e79f703596a98f5f8d87cdb0574fa67c0325253b68645dd90f55df2a1111eeced3920b9e6c1881ccd8f",
	"beff0a9cc16b3051a6a1d52b3bda331169e2b3d4398bff0433cb093437e98039156a440f409b3ca0a291eec3a1ca2d75",
	"fa228fe40cf0a4bc5ee0dee05f19fd0b780a4510c52917b86e9e95ed8d0800709e8c20881db48dfaf5f839da2a6385b2",
	"b30fb9715567020db7fc7e80f8512bec9229fcb6e429ffcb921b8e40d07af8dbab578f29cd4c1a382d5d0eb6b46579af",
	"3baf3569e7771d3c45513c295810d860664d4242e97ddb5beb2e732ba4b90f1bc3cd9b018a7b0ea6153aaed84ac03404",
	"6dd17d4fc0ff2d9b3a6da9b4bed4de29a2a5ab545c26738c314ecf7cc0eae5dd5275f918f25cd148f4d95ca77bbcffa7",
	"8f507adff89bf75f28d5b23f5af00ccdeb98c80da2dfa6ef9b85646f0fd3d234be01837596a0d01aa8bac6a9a42f80c3",
	"1de854617fb5b1e18f7981f862f1cbab3faea95abe24c64837844bb71181a54fde062ff807465d7f35cf838194f09573"
];
for(var i=0;i<customer_key.length;i++){
	var decipher = crypto.createDecipheriv('aes-128-cbc', "posist-open-apis", "@@@@&&&&####$$$$");
	var deployment_id = (decipher.update(customer_key[i], 'hex', 'utf8') + decipher.final('utf8')).split(":")[1];
	console.log(i+':'+deployment_id);
}
  