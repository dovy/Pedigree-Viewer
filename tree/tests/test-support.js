(function() {
	var data = {
		focus:0,
		people:[
		        
		     // new for 07/27/10, working on the bowtie chart.  these are descendants of Jared and Lydia.
		    {id:2001, fn:'Rebecca', sn:'Carter', s:'F', f:0, m:1, sp:null},
		    {id:2001, fn:'Abraham', sn:'Carter', s:'M', f:0, m:1, sp:null},
		             
			{id:10020, fn:'Joseph', sn:'Carter', s:'M', f:2, m:3, sp:null},  // gideon and johanna are parents, no spouse.  Joseph is Jared's brother in this scenario.

			{id:0, fn:'Jared', sn:'Carter', s:'M', f:2, m:3, sp:1},
			{id:1, fn:'Lydia', sn:'Ames', s:'F', f:4, m:5, sp:0},
				
			{id:2, fn:'Gideon', sn:'Carter', s:'M', f:6, m:7, sp:3},
			{id:3, fn:'Johanna', sn:'Sims', s:'F', f:null, m:null, sp:2},	
				
			{id:6, fn:'John', sn:'Carter', s:'M', f:12, m:13, sp:7},
			{id:7, fn:'Sarah', sn:'Waterous', s:'F', f:14, m:15, sp:6},  
			
			{id:12, fn:'John', sn:'Carter', s:'M', f:16, m:17, sp:13},
			{id:13, fn:'Sarah', sn:'Nettleton', s:'F', f:18, m:19, sp:12},   
			
			{id:14, fn:'Gideon', sn:'Waterhouse', s:'M', f:20, m:21, sp:15},
			{id:15, fn:'Rebecca', sn:'Waterhouse', s:'F', f:null, m:null, sp:14},   
			
			{id:16, fn:'Robert', sn:'Carter', s:'M', f:null, m:null, sp:17},
			{id:17, fn:'Hannah', sn:'Lucas', s:'F', f:null, m:null, sp:16},
			
			{id:18, fn:'Joseph', sn:'Nettleton', s:'M', f:null, m:null, sp:19},
			{id:19, fn:'Sarah', sn:'Woodmansee', s:'F', f:null, m:null, sp:18},
			
			{id:20, fn:'Abraham II', sn:'Waterhouse', s:'M', f:null, m:null, sp:21},
			{id:21, fn:'Hannah', sn:'Stark', s:'F', f:null, m:null, sp:20},  
					
			{id:4, fn:'Ithamer', sn:'Ames', s:'M', f:8, m:9, sp:5},
			{id:5, fn:'Hannah', sn:'Clark', s:'F', f:10, m:11, sp:4},
			
			{id:8, fn:'Joseph', sn:'Ames', s:'M', f:22, m:23, sp:9},
			{id:9, fn:'Elizabeth', sn:'Parker', s:'F', f:24, m:25, sp:8},            
			
			{id:10, fn:'William', sn:'Clarke', s:'M', f:26, m:27, sp:11},
			{id:11, fn:'Betsy', sn:'Rogers', s:'F', f:28, m:29, sp:10},						
					
			{id:22, fn:'William IV', sn:'Ames', s:'M', f:30, m:31,sp:23},
			{id:23, fn:'Elizabeth', on:'D', sn:'Jennings', s:'F', f:32, m:33, sp:22},       
			
			{id:24, fn:'Jesse', on:'Thomas', sn:'Parker', s:'M', f:null, m:null, sp:25},
			{id:25, fn:'Bathsheba', sn:' ', s:'F', f:null, m:null, sp:24},
			
			{id:26, fn:'Samuel', sn:'Clarke', s:'M', f:34, m:35, sp:27},
			{id:27, fn:'Hannah', sn:'Wilcox', s:'F', f:36, m:37, sp:26},  
			
			{id:28, fn:'Joseph', sn:'Rogers', s:'M', f:38, m:39, sp:29},
			{id:29, fn:'Diadema', sn:'Beckwith', s:'F', f:null, m:null, sp:28},
			
			{id:30, fn:'Williams', sn:'Ames', s:'M', f:null, m:null, sp:31},
			{id:31, fn:'Mary', on:'D', sn:'Hayward', s:'F', f:null, m:null, sp:30},
			
			{id:32, fn:'Richard', sn:'Jennings', s:'M', f:null, m:null, sp:33},
			{id:33, fn:'Mary', sn:'Bassett', s:'F', f:null, m:null, sp:32},
			
			{id:34, fn:'Jeremiah', sn:'Clarke', s:'M', f:null, m:null, sp:35},
			{id:35, fn:'Ann', sn:'Audley', md:'Odlin', s:'F', f:null, m:null, sp:34},
			
			{id:36, fn:'Daniel Jr', sn:'Wilcox', s:'M', f:null, m:null, sp:37},
			{id:37, fn:'Hannah', sn:'Cooke', s:'F', f:null, m:null, sp:36},
			
			{id:38, fn:'Joseph', sn:'Rogers', s:'M', f:null, m:null, sp:39},
			{id:39, fn:'Diadema', sn:'Beckwith', s:'F', f:null, m:null, sp:38} 
		]
	};	
	
	/* 
	 * this data is extension data for
	 * 
	 *  {id:30, fn:'Williams', sn:'Ames', s:'M', f:null, m:null, sp:31},
	 *		
	 *  whose father is initially null.  the tests using this data will simulate pulling this
	 *  data over the wire and dynamically inserting it into an existing chart.
	 *  
	 *  notice the difference between this and the initial data: the focus person here is not
	 *  just an id, it's a fully fledged person record.  perhaps the initial data should be changed to 
	 *  use this format?
	 */
	var extensionData = {
		focus:{id:30, fn:'Williams', sn:'Ames', s:'M', f:3000, m:3001, sp:31},
		people : [
		    {id:3000, fn:'Mark', sn:'Ames', s:'M', f:3002, m:3003, sp:3001},
		    {id:3001, fn:'Mary', sn:'Mott', s:'M', f:null, m:null, sp:3000},
		    
		    {id:3002, fn:'Andrew', sn:'Ames', s:'M', f:3004, m:3005, sp:3003},
		    {id:3003, fn:'Ann', sn:'Wilcox', s:'M', f:null, m:null, sp:3002},
		    
		    {id:3004, fn:'Arthur', sn:'Ashe', s:'M', f:null, m:null, sp:3005},
		    {id:3005, fn:'Olivia', sn:'Beckhurst', s:'M', f:null, m:null, sp:3004}
		          
		]		
	};
	
	var circularDependencyData = {"focus":"3990","people":[
{"nfs_id":"KW6F-2DN","id":"3990","fn":"Dovydas R Paukstys","s":"M","m":"3993","f":"3992"},
 
{"id":"3993","nfs_id":"KW8X-J8G","fn":"Ladawn Mason","s":"F","sp":"3992","m":"3997","f":"3996"},
 
{"id":"3992","nfs_id":"2774-Z86","fn":"Romualdas B Paukstys","s":"M","sp":"3993","m":"3995","f":"3994"},
 
{"id":"3995","nfs_id":"277H-3CL","fn":"Kazimiera Gurinskaite","s":"F","sp":"3994","m":"4000","f":"3999"},
 {"id":"3994","nfs_id":"277H-SWR","fn":"Pranas Paukstys","s":"M","sp":"3995","f":"3998"},
 {"id":"3997","nfs_id":"KWCJ-7HZ","fn":"Rita Joy Braegger","s":"F","sp":"3996","m":"4004","f":"4003"},
 {"id":"3996","nfs_id":"KWCJ-7HC","fn":"Lloyd Mason","s":"M","sp":"3997","m":"4002","f":"4001"},
 {"id":"4000","nfs_id":"277H-5HF","fn":"Magdalena Puidaite","s":"F","sp":"3999"},
 {"id":"3999","nfs_id":"277H-31M","fn":"Jonas Gurinskas","s":"M","sp":"4000"},
 {"id":"3998","nfs_id":"9NW4-DXJ","fn":"Bronius Paukstys","s":"M"},
 {"id":"4002","nfs_id":"KWCX-3HP","fn":"Kate Diantha Johnson","s":"F","sp":"4001","m":"4008","f":"4007"},
 {"id":"4001","nfs_id":"KWCX-3H5","fn":"Royal Lional Mason","s":"M","sp":"4002","m":"4006","f":"4005"},
 {"id":"4004","nfs_id":"KWCZ-4H5","fn":"Grace Reid","s":"F","sp":"4003","m":"23","f":"4011"},
 {"id":"4003","nfs_id":"KWCZ-4HG","fn":"David W Braegger","s":"M","sp":"4004","m":"4010","f":"4009"},
 {"id":"4006","nfs_id":"KW86-WV2","fn":"Charlotte Emma Tims","s":"F","sp":"4005","m":"4013","f":"4012"},
 {"id":"4005","nfs_id":"KW86-WVL","fn":"George Jesse Mason","s":"M","sp":"4006","m":"25","f":"24"},
 {"id":"4008","nfs_id":"KWZH-X9C","fn":"Margarit Estella Henrie","s":"F","sp":"4007","m":"4017","f":"4016"},
 {"id":"4007","nfs_id":"KWZH-X9H","fn":"Alma Johnson","s":"M","sp":"4008","m":"4015","f":"4014"},
 {"id":"23","nfs_id":"LW65-Y2M","fn":"Elisabeth Irvine","s":"F","sp":"4011","m":"4025","f":"4024"},
 {"id":"4011","nfs_id":"LW65-YCP","fn":"William Reid","s":"M","sp":"23","m":"4023","f":"4022"},
 {"id":"4010","nfs_id":"KWCZ-4HM","fn":"Carolina Sophie","s":"F","sp":"4009","m":"4021","f":"4020"},
 {"id":"4009","nfs_id":"KWCZ-441","fn":"John George Braegger","s":"M","sp":"4010","m":"4019","f":"4018"},
 {"id":"4013","nfs_id":"KWJY-B7T","fn":"Charlotte Marshall","s":"F","sp":"4012","m":"4033","f":"4032"},
 {"id":"4012","nfs_id":"KWJY-B75","fn":"John Gardner Tims","s":"M","sp":"4013","m":"4031","f":"4030"},
 {"id":"25","nfs_id":"KWJF-W72","fn":"Hannah Electa Gardner","s":"F","sp":"24","m":"4029","f":"4028"},
 {"id":"24","nfs_id":"KWNF-67D","fn":"George Sterling MASON","s":"M","sp":"25","m":"4027","f":"4026"},
 {"id":"4019","nfs_id":"KWN1-ZJL","fn":"Salome Brunner","s":"F","sp":"4018","m":"4045","f":"4044"},
 {"id":"4018","nfs_id":"KWN1-ZJG","fn":"Johann Abraham Braegger","s":"M","sp":"4019","m":"4043","f":"4042"},
 {"id":"4021","nfs_id":"KPDG-RCJ","fn":"Maria Nickli","s":"F","sp":"4020"},
 {"id":"4020","nfs_id":"K2X8-T19","fn":"Samuel Wodtli","s":"M","sp":"4021","m":"4047","f":"4046"},
 {"id":"4017","nfs_id":"KWJ4-LHM","fn":"Amanda Bradley","s":"F","sp":"4016","m":"4041","f":"4040"},
 {"id":"4016","nfs_id":"KWNY-LQ3","fn":"Daniel Henrie","s":"M","sp":"4017","m":"4039","f":"4038"},
 {"id":"4015","nfs_id":"KWJ4-465","fn":"Elizabeth Johnston","s":"F","sp":"4014","m":"4037","f":"4036"},
 {"id":"4014","nfs_id":"KWJ7-HVB","fn":"Robert Johnson","s":"M","sp":"4015","m":"4035","f":"4034"},
 {"id":"4025","nfs_id":"2ZSC-LCK","fn":"Elisabeth Mcclement","s":"F","sp":"4024"},
 {"id":"4024","nfs_id":"2ZSC-2FS","fn":"William Irvine","s":"M","sp":"4025"},
 {"id":"4023","nfs_id":"LS92-8N5","fn":"Mary Parker","s":"F","sp":"4022","m":"4051","f":"4050"},
 {"id":"4022","nfs_id":"LS92-8F5","fn":"William Reid","s":"M","sp":"4023","m":"4049","f":"4048"},
 {"id":"4047","nfs_id":"K8MD-92R","fn":"Elisabeth Mueller","s":"F","sp":"4046"},
 {"id":"4046","nfs_id":"KNBM-WNQ","fn":"Hans Jacob Woodli","s":"M","sp":"4047","m":"4089","f":"4088"},
 {"id":"4037","nfs_id":"L7FV-4YB","fn":"Elizabeth Clarke","s":"F","sp":"4036","m":"4071","f":"4070"},
 {"id":"4036","nfs_id":"LQRV-L45","fn":"Joseph Johnston","s":"M","sp":"4037"},
 {"id":"4041","nfs_id":"KWJT-BZV","fn":"Betsey Elizabeth Kroll","s":"F","sp":"4040","m":"4079","f":"4078"},
 {"id":"4040","nfs_id":"2Z4D-WWK","fn":"THOMAS J Bradley","s":"M","sp":"4041","m":"4077","f":"4076"},
 {"id":"4035","nfs_id":"LWYG-9V7","fn":"Ann Edwards","s":"F","sp":"4034","m":"4069","f":"4068"},
 {"id":"4034","nfs_id":"LWYG-9TX","fn":"William Johnson","s":"M","sp":"4035","m":"4067","f":"4066"},
 {"id":"4029","nfs_id":"KWJH-HMR","fn":"Electa Lamport","s":"F","sp":"4028","m":"4057","f":"4056"},
 {"id":"4028","nfs_id":"KWJH-HM5","fn":"Benjamin Gardner","s":"M","sp":"4029","m":"4055","f":"4054"},
 {"id":"4031","nfs_id":"KWV7-RQN","fn":"Sarah Gardner","s":"F","sp":"4030","m":"4061","f":"4060"},
 {"id":"4030","nfs_id":"K1XH-2TT","fn":"James Tims","s":"M","sp":"4031","m":"4059","f":"4058"},
 {"id":"4033","nfs_id":"L7R9-ZNT","fn":"Maria Bromley","s":"F","sp":"4032","m":"4065","f":"4064"},
 {"id":"4032","nfs_id":"L7J8-YN2","fn":"Charles Marshall","s":"M","sp":"4033","m":"4063","f":"4062"},
 {"id":"4043","nfs_id":"L71J-XRX","fn":"Elisabeth Schweitzer","s":"F","sp":"4042","m":"4083","f":"4082"},
 {"id":"4042","nfs_id":"LWS3-FDN","fn":"Johannes Braker","s":"M","sp":"4043","m":"4081","f":"4080"},
 {"id":"4045","nfs_id":"KPST-FRN","fn":"Elisabeth Eichholzer","s":"F","sp":"4044","m":"4087","f":"4086"},
 {"id":"4044","nfs_id":"KWVH-HJT","fn":"Johannes Brunner","s":"M","sp":"4045","m":"4085","f":"4084"},
 {"id":"4027","nfs_id":"KP4G-25B","fn":"Harriet Warner","s":"F","sp":"4026"},
 {"id":"4026","nfs_id":"L7GZ-CXS","fn":"Jesse Mason","s":"M","sp":"4027","m":"4053","f":"4052"},
 {"id":"4039","nfs_id":"K2WJ-9QZ","fn":"Myra Mayall","s":"F","sp":"4038","m":"4075","f":"4074"},
 {"id":"4038","nfs_id":"KWJD-D9Q","fn":"William Henrie","s":"M","sp":"4039","m":"4073","f":"4072"},
 {"id":"4049","nfs_id":"LSS9-VV5","fn":"Jean Robie","s":"F","sp":"4048","m":"4093","f":"4092"},
 {"id":"4048","nfs_id":"LSS9-VJY","fn":"Andrew Reid","s":"M","sp":"4049","m":"4091","f":"4090"},
 {"id":"4051","nfs_id":"L7FG-62M","fn":"Mary Wilson","s":"F","sp":"4050","m":"4097","f":"4096"},
 {"id":"4050","nfs_id":"L7X2-5D5","fn":"William Parker","s":"M","sp":"4051","m":"4095","f":"4094"},
 {"id":"4077","nfs_id":"L76G-GKB","fn":"Abiah ( Richmond","s":"F","sp":"4076","m":"4145","f":"4144"},
 {"id":"4076","nfs_id":"2Z4D-7MV","fn":"James Pierce Bradley","s":"M","sp":"4077","m":"4143","f":"4142"},
 {"id":"4059","nfs_id":"K1XH-G21","fn":"Elizabeth Giles","s":"F","sp":"4058","m":"4113","f":"4112"},
 {"id":"4058","nfs_id":"K1XH-GKX","fn":"John Tims","s":"M","sp":"4059","m":"4111","f":"4110"},
 {"id":"4075","nfs_id":"LW65-ZZB","fn":"Margaret","s":"F","sp":"4074","m":"4140","f":"4141"},
 {"id":"4074","nfs_id":"L7G1-QCR","fn":"John MAYALL","s":"M","sp":"4075","m":"4140","f":"4139"},
 {"id":"4089","nfs_id":"KC8N-JSC","fn":"Anna Barbara","s":"F","sp":"4088","m":"4167","f":"4166"},
 {"id":"4088","nfs_id":"KCS3-GS2","fn":"Hans Jacob Woodli","s":"M","sp":"4089","m":"4165","f":"4164"},
 {"id":"4087","nfs_id":"L7NF-3YR","fn":"Anna Barbara","s":"F","sp":"4086","m":"4163","f":"4162"},
 {"id":"4086","nfs_id":"L7NV-FD5","fn":"Nicolaus Eichholzer","s":"M","sp":"4087","m":"4163","f":"4162"},
 {"id":"4073","nfs_id":"L72N-LFX","fn":"Sarah Mondal Or Mundell","s":"F","sp":"4072","m":"4138","f":"4137"},
 {"id":"4072","nfs_id":"L72N-LTS","fn":"Daniel Arthur Henrie","s":"M","sp":"4073","m":"4136","f":"4135"},
 {"id":"4055","nfs_id":"LWMQ-ZQ9","fn":"Hannah Giles","s":"F","sp":"4054","m":"4105","f":"4104"},
 {"id":"4054","nfs_id":"LWZ7-8LV","fn":"Nathanial Bryan Gardner","s":"M","sp":"4055","m":"4103","f":"4102"},
 {"id":"4057","nfs_id":"LW3Y-TPS","fn":"Martha Babbitt","s":"F","sp":"4056","m":"4109","f":"4108"},
 {"id":"4056","nfs_id":"LWS9-DVT","fn":"William Lamport Jr.","s":"M","sp":"4057","m":"4107","f":"4106"},
 {"id":"4079","nfs_id":"L7GD-MNX","fn":"Mary","s":"F","sp":"4078","m":"4149","f":"4148"},
 {"id":"4078","nfs_id":"L7GD-MW1","fn":"George Henry Kroll","s":"M","sp":"4079","m":"4147","f":"4146"},
 {"id":"4061","nfs_id":"L716-3WR","fn":"Mary Tims","s":"F","sp":"4060","m":"4117","f":"4116"},
 {"id":"4060","nfs_id":"L7PM-X4M","fn":"Daniel Gardner","s":"M","sp":"4061","m":"4115","f":"4114"},
 {"id":"4085","nfs_id":"2Z9C-SF5","fn":"Sara Frei","s":"F","sp":"4084","m":"4161","f":"4160"},
 {"id":"4084","nfs_id":"2Z9C-SZL","fn":"Johann Jakob Brunner","s":"M","sp":"4085","m":"4159","f":"4158"},
 {"id":"4083","nfs_id":"KGCS-QKB","fn":"Anna B Schaellibaum","s":"F","sp":"4082","m":"4157","f":"4156"},
 {"id":"4082","nfs_id":"KGCS-QDZ","fn":"Elias Schweizer","s":"M","sp":"4083","m":"4155","f":"4154"},
 {"id":"4097","nfs_id":"L7F1-NT9","fn":"Marion Murray","s":"F","sp":"4096"},
 {"id":"4096","nfs_id":"L7F1-NPR","fn":"Joseph Wilson","s":"M","sp":"4097"},
 {"id":"4071","nfs_id":"L7BW-H1Z","fn":"Mary","s":"F","sp":"4070"},
 {"id":"4070","nfs_id":"LWZ8-V25","fn":"William Clark","s":"M","sp":"4071","m":"4134","f":"4133"},
 {"id":"4053","nfs_id":"L7GW-X3V","fn":"Mehitable White Pratt","s":"F","sp":"4052","m":"4101","f":"4100"},
 {"id":"4052","nfs_id":"KP4P-686","fn":"David Mason","s":"M","sp":"4053","m":"4099","f":"4098"},
 {"id":"4063","nfs_id":"K1XX-W5Y","fn":"Mary Hazelwood","s":"F","sp":"4062","m":"4121","f":"4120"},
 {"id":"4062","nfs_id":"L7TW-Q8M","fn":"Willam Marshall","s":"M","sp":"4201","m":"4119","f":"4118"},
 {"id":"4065","nfs_id":"L7R9-ZV3","fn":"Elizabeth Soden","s":"F","sp":"4064","m":"4125","f":"4124"},
 {"id":"4064","nfs_id":"L7R9-ZJ5","fn":"Thomas Bromley","s":"M","sp":"4065","m":"4123","f":"4122"},
 {"id":"4095","nfs_id":"L7X2-T26","fn":"Barbara McClymont","s":"F","sp":"4094","m":"4173","f":"4172"},
 {"id":"4094","nfs_id":"L7X2-TV2","fn":"William Parker","s":"M","sp":"4095"},
 {"id":"4091","nfs_id":"LSSS-8JY","fn":"Agnes Watt","s":"F","sp":"4090"},
 {"id":"4090","nfs_id":"LSSS-8NP","fn":"William Reid","s":"M","sp":"4091"},
 {"id":"4093","nfs_id":"2ZS9-HKX","fn":"Margaret Brown","s":"F","sp":"4092","m":"4171","f":"4170"},
 {"id":"4092","nfs_id":"2ZS9-HJB","fn":"William Robie","s":"M","sp":"4093","m":"4169","f":"4168"},
 {"id":"4081","nfs_id":"KPST-F2J","fn":"Elisabeth Buhlmann","s":"F","sp":"4080","m":"4153","f":"4152"},
 {"id":"4080","nfs_id":"L479-H4T","fn":"Johann Jacob Braker","s":"M","sp":"4081","m":"4151","f":"4150"},
 {"id":"4067","nfs_id":"LQRD-CL3","fn":"Martha Nickson","s":"F","sp":"4066","m":"4129","f":"4128"},
 {"id":"4066","nfs_id":"LQRD-4CX","fn":"William Johnson","s":"M","sp":"4067","m":"4127","f":"4126"},
 {"id":"4069","nfs_id":"L7NR-MCX","fn":"Margaret Thomas","s":"F","sp":"4068","m":"4132"},
 {"id":"4068","nfs_id":"L711-YL4","fn":"John Edwards","s":"M","sp":"4069","m":"4131","f":"4130"},
 {"id":"4143","nfs_id":"KP4N-BXL","fn":"Susannah Pierce","s":"F","sp":"4142","m":"4229","f":"4228"},
 {"id":"4142","nfs_id":"2F8Z-MW5","fn":"George Bradley","s":"M","sp":"4143","m":"4227","f":"4226"},
 {"id":"4161","nfs_id":"KP7F-PYL","fn":"Anna Buehler","s":"F","sp":"4160","m":"4261","f":"4260"},
 {"id":"4160","nfs_id":"KP4W-7PD","fn":"Dionysius Frey","s":"M","sp":"4161","m":"4259","f":"4258"},
 {"id":"4159","nfs_id":"2Z9D-SY2","fn":"Ana Margaretha Bruner","s":"F","sp":"4158","m":"4257","f":"4256"},
 {"id":"4158","nfs_id":"2Z9D-SFQ","fn":"Johannes Brunner","s":"M","sp":"4159","m":"4255","f":"4254"},
 {"id":"4169","nfs_id":"2ZS9-4R3","fn":"Margaret Tait","s":"F","sp":"4168"},
 {"id":"4168","nfs_id":"2ZS9-H3R","fn":"James Robie","s":"M","sp":"4169"},
 {"id":"4171","nfs_id":"28YZ-FS5","fn":"Margaret Mackeene","s":"F","sp":"4170"},
 {"id":"4170","nfs_id":"28YH-H69","fn":"Robert Brown","s":"M","sp":"4171"},
 {"id":"4113","nfs_id":"KG3M-QF5","fn":"Elizabeth Wilcox","s":"F","sp":"4112"},
 {"id":"4112","nfs_id":"KG3M-Q3M","fn":"John Gyles","s":"M","sp":"4113","m":"4196","f":"4195"},
 {"id":"4111","nfs_id":"KPC4-2HP","fn":"Ann White","s":"F","sp":"4110","m":"4194","f":"4193"},
 {"id":"4110","nfs_id":"K1XH-5H1","fn":"Richard Tims","s":"M","sp":"4111","m":"4192","f":"4191"},
 {"id":"4121","nfs_id":"KPH4-PCY","fn":"Anne Archer","s":"F","sp":"4120","m":"4205","f":"4204"},
 {"id":"4120","nfs_id":"KPH4-G24","fn":"William Hazelwood","s":"M","sp":"4121","m":"4203","f":"4202"},
 {"id":"4167","nfs_id":"K4RX-M27","fn":"Barbara Luescher","s":"F","sp":"4166"},
 {"id":"4166","nfs_id":"KZXX-4YB","fn":"Jakob","s":"M","sp":"4167","m":"4271","f":"4270"},
 {"id":"4165","nfs_id":"KC8H-T4T","fn":"Anna Kloeti","s":"F","sp":"4164","m":"4269","f":"4268"},
 {"id":"4164","nfs_id":"KHHN-4BD","fn":"Johannes or Hans Woodli","s":"M","sp":"4165","m":"4267","f":"4266"},
 {"id":"4155","nfs_id":"KCX6-YW7","fn":"Anna Margaretha Wild","s":"F","sp":"4154","m":"4249","f":"4248"},
 {"id":"4154","nfs_id":"KP3H-88K","fn":"Niklaus Schweizer","s":"M","sp":"4155","m":"4247","f":"4246"},
 {"id":"4157","nfs_id":"KHR2-6ZZ","fn":"Anna Roth","s":"F","sp":"4156","m":"4253","f":"4252"},
 {"id":"4156","nfs_id":"KCR9-ZRC","fn":"Hans M Schaellibaum","s":"M","sp":"4157","m":"4251","f":"4250"},
 {"id":"4099","nfs_id":"2Q22-B4Y","fn":"Lois Mason","s":"F","sp":"4098","m":"4175","f":"4176"},
 {"id":"4098","nfs_id":"L7JL-LRY","fn":"Jesse Mason","s":"M","sp":"4099","m":"4175","f":"4174"},
 {"id":"4153","nfs_id":"2CBB-GYZ","fn":"Elisabeth Hellin","s":"F","sp":"4152","m":"4245","f":"4244"},
 {"id":"4152","nfs_id":"KZB6-YBV","fn":"Hans Jacob Buelmann","s":"M","sp":"4153","m":"4243","f":"4242"},
 {"id":"4151","nfs_id":"KPSR-TXC","fn":"Regula Ambuhl","s":"F","sp":"4150","m":"4241","f":"4240"},
 {"id":"4150","nfs_id":"2JS8-3G1","fn":"Johannes Braeker","s":"M","sp":"4151","m":"4239","f":"4238"},
 {"id":"4131","nfs_id":"9MP4-TX6","fn":"Miss Edwards","s":"F","sp":"4130"},
 {"id":"4130","nfs_id":"LQRX-PYQ","fn":"Mr Edwards","s":"M","sp":"4131"},
 {"id":"4117","nfs_id":"L7PM-X8D","fn":"Mary","s":"F","sp":"4116"},
 {"id":"4116","nfs_id":"L7PM-XDL","fn":"Daniel Tims","s":"M","sp":"4117"},
 {"id":"4138","nfs_id":"L72N-KPD","fn":"Margaret Garrett","s":"F","sp":"4137","m":"4221","f":"4220"},
 {"id":"4137","nfs_id":"L72N-27Q","fn":"James Mundell","s":"M","sp":"4138","m":"4219","f":"4218"},
 {"id":"4136","nfs_id":"L72N-2RT","fn":"Elisabeth","s":"F","sp":"4135"},
 {"id":"4135","nfs_id":"L72N-JM9","fn":"Michael Henarie","s":"M","sp":"4136","m":"4217","f":"4216"},
 {"id":"4145","nfs_id":"2MQ2-TXJ","fn":"Sarah Patterson","s":"F","sp":"4144","m":"4233","f":"4232"},
 {"id":"4144","nfs_id":"2Z3W-8QQ","fn":"Zephaniah Richmond","s":"M","sp":"4145","m":"4231","f":"4230"},
 {"id":"4140","nfs_id":"L72J-DS1","fn":"Mary","s":"F","sp":"4141","m":"4225","f":"4224"},
 {"id":"4139","nfs_id":"L7L1-G3Y","fn":"John Mayall Jr.","s":"M","sp":"4140","m":"4223","f":"4222"},
 {"id":"4149","nfs_id":"2JBW-288","fn":"Cathy Katis","s":"F","sp":"4148"},
 {"id":"4148","nfs_id":"2Z3W-8ZL","fn":"Lewis Waltman","s":"M","sp":"4149","m":"4237","f":"4236"},
 {"id":"4147","nfs_id":"L7GD-9T7","fn":"Kroll","s":"F","sp":"4146"},
 {"id":"4146","nfs_id":"L7GD-9PR","fn":"Kroll","s":"M","sp":"4147","m":"4235","f":"4234"},
 {"id":"4101","nfs_id":"KLLD-QLB","fn":"Mahitable Walker","s":"F","sp":"4100","m":"4180","f":"4179"},
 {"id":"4100","nfs_id":"KZMX-826","fn":"Cornelius White","s":"M","sp":"4101","m":"4178","f":"4177"},
 {"id":"4163","nfs_id":"2Z9X-WDX","fn":"Anna Elisabeth Braker","s":"F","sp":"4162","m":"4265","f":"4264"},
 {"id":"4162","nfs_id":"2Z9X-W4Z","fn":"Bernhard Aerne","s":"M","sp":"4163","m":"4263","f":"4262"},
 {"id":"4132","nfs_id":"94RB-SL4","fn":"Mary","s":"F"},
 {"id":"4115","nfs_id":"KLFQ-K1Q","fn":"Elizabeth Washbrook","s":"F","sp":"4114","m":"4200","f":"4199"},
 {"id":"4114","nfs_id":"KLY4-65C","fn":"Richard Gardner","s":"M","sp":"4115","m":"4198","f":"4197"},
 {"id":"4123","nfs_id":"MTMD-1GH","fn":"Mary","s":"F","sp":"4122"},
 {"id":"4122","nfs_id":"MTMD-1LT","fn":"John","s":"M","sp":"4123"},
 {"id":"4125","nfs_id":"K1FQ-14G","fn":"Mary Goldby","s":"F","sp":"4124"},
 {"id":"4124","nfs_id":"K1FQ-1WW","fn":"Joseph Soden","s":"M","sp":"4125"},
 {"id":"4119","nfs_id":"KN98-B8J","fn":"Joan","s":"F","sp":"4118"},
 {"id":"4118","nfs_id":"L7TW-QCK","fn":"Thomas Marshall","s":"M","sp":"4119","m":"4201","f":"4062"},
 {"id":"4173","nfs_id":"K4D1-N8L","fn":"Margaret Cunnock","s":"F","sp":"4172"},
 {"id":"4172","nfs_id":"KHSK-G6X","fn":"Gilbert McLemont","s":"M","sp":"4173","m":"4273","f":"4272"},
 {"id":"4127","nfs_id":"L9HQ-FM4","fn":"Ann Davis","s":"F","sp":"4126"},
 {"id":"4126","nfs_id":"L9HQ-XV5","fn":"Jeremiah Johnson","s":"M","sp":"4127","m":"4207","f":"4206"},
 {"id":"4129","nfs_id":"LQR8-2PX","fn":"Mary","s":"F","sp":"4128","m":"4211","f":"4210"},
 {"id":"4128","nfs_id":"L7TT-5H6","fn":"Joseph Nixon","s":"M","sp":"4129","m":"4209","f":"4208"},
 {"id":"4109","nfs_id":"L78Y-QX7","fn":"Amely Tefft","s":"F","sp":"4108","m":"4190","f":"4189"},
 {"id":"4108","nfs_id":"L78Y-Q6F","fn":"Elijah * Babbitt","s":"M","sp":"4109","m":"4188","f":"4187"},
 {"id":"4141","nfs_id":"L4QJ-7F8","fn":"John Jr. Mayall","s":"M","sp":"4140","m":"4223","f":"4222"},
 {"id":"4105","nfs_id":"L717-YZC","fn":"Lydia Almy Higby","s":"F","sp":"4104"},
 {"id":"4104","nfs_id":"26LW-18Z","fn":"Daniel BRIGGs","s":"M","sp":"4105","m":"4186","f":"4185"},
 {"id":"4107","nfs_id":"L78Y-Q6C","fn":"Elizabeth GREEN","s":"F","sp":"4106"},
 {"id":"4106","nfs_id":"L78Y-QDB","fn":"William LAMPORT","s":"M","sp":"4107"},
 {"id":"4103","nfs_id":"LWYJ-M4Y","fn":"Mary Howland","s":"F","sp":"4102","m":"4184","f":"4183"},
 {"id":"4102","nfs_id":"LWYJ-MXX","fn":"Benjamin","s":"M","sp":"4103","m":"4182","f":"4181"},
 {"id":"4134","nfs_id":"K1WZ-L4P","fn":"Mary Powder (Sworder)","s":"F","sp":"4133","m":"4215","f":"4214"},
 {"id":"4133","nfs_id":"L7JD-42T","fn":"Thomas Clark","s":"M","sp":"4134","m":"4213","f":"4212"},
 {"id":"4186","nfs_id":"KNW6-WSP","fn":"Lydia Richardson","s":"F","sp":"4185"},
 {"id":"4185","nfs_id":"L4QR-BSB","fn":"Thomas Briggs Sr.","s":"M","sp":"4186"},
 {"id":"4245","nfs_id":"L49K-9SW","fn":"Elisabeth Nuessli","s":"F","sp":"4244"},
 {"id":"4244","nfs_id":"KZ3J-HZZ","fn":"Samuel Hell","s":"M","sp":"4245"},
 {"id":"4227","nfs_id":"L7GD-JF8","fn":"Ametee Hawes","s":"F","sp":"4226"},
 {"id":"4226","nfs_id":"L4MK-NM5","fn":"Nathan Bradley","s":"M","sp":"4227"},
 {"id":"4239","nfs_id":"LWYY-YH9","fn":"Anna Maria Zuber","s":"F","sp":"4238"},
 {"id":"4238","nfs_id":"LWYY-YMF","fn":"Hans Braeker","s":"M","sp":"4239"},
 {"id":"4233","nfs_id":"L7KM-NHH","fn":"Dougharty","s":"F","sp":"4232"},
 {"id":"4232","nfs_id":"L7KM-NWT","fn":"Thomas Patterson","s":"M","sp":"4233"},
 {"id":"4175","nfs_id":"2DXL-P2D","fn":"Hannah Haile\\Hail\\Hale","s":"F","sp":"4174"},
 {"id":"4176","nfs_id":"2ZSC-N57","fn":"Peletiah Jr. Mason","s":"M","sp":"4175"},
 {"id":"4231","nfs_id":"LQR7-25S","fn":"(1) Abiah Elliott","s":"F","sp":"4230"},
 {"id":"4230","nfs_id":"LW6G-Q5H","fn":"Capt. S Richmond","s":"M","sp":"4231"},
 {"id":"4237","nfs_id":"2JB7-7RW","fn":"MRs. Waltman","s":"F","sp":"4236"},
 {"id":"4236","nfs_id":"2JB7-75J","fn":"Mr. Waltman","s":"M","sp":"4237"},
 {"id":"4255","nfs_id":"L7NW-4X4","fn":"Ana Or","s":"F","sp":"4254"},
 {"id":"4254","nfs_id":"2WNT-JRV","fn":"Christian Brunner","s":"M","sp":"4255"},
 {"id":"4257","nfs_id":"2ZS9-2MG","fn":"Elisabeth Lueber","s":"F","sp":"4256"},
 {"id":"4256","nfs_id":"2ZS9-KB6","fn":"Josua Brunner","s":"M","sp":"4257"},
 {"id":"4263","nfs_id":"2CT1-GWP","fn":"Afra ","s":"F","sp":"4262"},
 {"id":"4262","nfs_id":"KPQ5-TPB","fn":"Ulrich","s":"M","sp":"4263"},
 {"id":"4265","nfs_id":"2ZSW-TGS","fn":"Anna Kaufmann","s":"F","sp":"4264"},
 {"id":"4264","nfs_id":"27HV-2JM","fn":"Hans Valentin Braeker","s":"M","sp":"4265"},
 {"id":"4215","nfs_id":"K6SR-LWS","fn":"Mrs. Francis Sworder","s":"F","sp":"4214"},
 {"id":"4214","nfs_id":"K63X-GBG","fn":"Edmund Sworder","s":"M","sp":"4215"},
 {"id":"4192","nfs_id":"KG39-QGC","fn":"Judith Worral","s":"F","sp":"4191"},
 {"id":"4191","nfs_id":"KG39-7CL","fn":"John Tims","s":"M","sp":"4192"},
 {"id":"4269","nfs_id":"K8SP-CYL","fn":"Anna Pluess","s":"F","sp":"4268"},
 {"id":"4268","nfs_id":"K8RD-W9R","fn":"Georg Kloeti","s":"M","sp":"4269"},
 {"id":"4251","nfs_id":"K8N2-WTB","fn":"Anna Grob","s":"F","sp":"4250"},
 {"id":"4250","nfs_id":"KPQS-ZHR","fn":"Niclaus Schaellibaum","s":"M","sp":"4251"},
 {"id":"4249","nfs_id":"2WC9-XG9","fn":"Anna M Anderegg","s":"F","sp":"4248"},
 {"id":"4248","nfs_id":"2WC9-F35","fn":"Hans Jacob Wild","s":"M","sp":"4249"},
 {"id":"4196","nfs_id":"9NWR-JHM","fn":"Mrs-Alicia ( Gyles","s":"F","sp":"4195"},
 {"id":"4195","nfs_id":"9NWR-J41","fn":"Richard Gyles","s":"M","sp":"4196"},
 {"id":"4267","nfs_id":"KCNQ-M8J","fn":"Maria Graber","s":"F","sp":"4266"},
 {"id":"4266","nfs_id":"K8W3-M2W","fn":"Hans Woodli","s":"M","sp":"4267"},
 {"id":"4253","nfs_id":"LQ5B-LPR","fn":"Elisabeth Roetti","s":"F","sp":"4252"},
 {"id":"4252","nfs_id":"2WFL-BJC","fn":"Hans Melchior Roth","s":"M","sp":"4253"},
 {"id":"4273","nfs_id":"L7FG-X7X","fn":"Agnas Davidson","s":"F","sp":"4272"},
 {"id":"4272","nfs_id":"L7FG-XDV","fn":"Gilbert ( McLemont","s":"M","sp":"4273"},
 {"id":"4200","nfs_id":"L7PM-FSJ","fn":"Ann Shearman","s":"F","sp":"4199"},
 {"id":"4199","nfs_id":"KHDJ-N3N","fn":"Edward Washbrook","s":"M","sp":"4200"},
 {"id":"4180","nfs_id":"LWCF-7KG","fn":"Bathsheba Brooks","s":"F","sp":"4179"},
 {"id":"4179","nfs_id":"LWCF-7G1","fn":"James Walker","s":"M","sp":"4180"},
 {"id":"4198","nfs_id":"2MBB-3HM","fn":"Sarah Crossley","s":"F","sp":"4197"},
 {"id":"4197","nfs_id":"2MBB-SJX","fn":"John Gardner","s":"M","sp":"4198"},
 {"id":"4247","nfs_id":"KP36-TNT","fn":"Elisabeth Hueberli","s":"F","sp":"4246"},
 {"id":"4246","nfs_id":"KP36-T2X","fn":"Heini Schweizer","s":"M","sp":"4247"},
 {"id":"4229","nfs_id":"KPQ5-ZC7","fn":"Keturah Newland","s":"F","sp":"4228"},
 {"id":"4228","nfs_id":"KPQ5-CTC","fn":"Anthony Pierce","s":"M","sp":"4229"},
 {"id":"4259","nfs_id":"278Y-Y83","fn":"Wyberth Schweizer","s":"F","sp":"4258"},
 {"id":"4258","nfs_id":"L4Q4-H62","fn":"Christian Frey","s":"M","sp":"4259"},
 {"id":"4261","nfs_id":"2ZS3-14S","fn":"Verena Lieberherr","s":"F","sp":"4260"},
 {"id":"4260","nfs_id":"2ZS3-18H","fn":"Abraham Bueeler","s":"M","sp":"4261"},
 {"id":"4194","nfs_id":"KPH4-1ZX","fn":"Ann Stow","s":"F","sp":"4193"},
 {"id":"4193","nfs_id":"KPH7-YX3","fn":"Thomas White","s":"M","sp":"4194"},
 {"id":"4203","nfs_id":"KPH4-YWN","fn":"Hannah","s":"F","sp":"4202"},
 {"id":"4202","nfs_id":"KPH4-Y79","fn":"Thomas Hazelwood","s":"M","sp":"4203"},
 {"id":"4205","nfs_id":"KPCX-P4X","fn":"Elizabeth Stanton","s":"F","sp":"4204"},
 {"id":"4204","nfs_id":"KPCX-PW2","fn":"Richard Archer","s":"M","sp":"4205"},
 {"id":"4241","nfs_id":"KPS1-LVB","fn":"Susana Hell","s":"F","sp":"4240"},
 {"id":"4240","nfs_id":"2CYW-7K1","fn":"Abraham","s":"M","sp":"4241"},
 {"id":"4243","nfs_id":"2CBY-Q3J","fn":"Anna Barbara Leuethi","s":"F","sp":"4242"},
 {"id":"4242","nfs_id":"2CBY-9GB","fn":"Abraham Buehler","s":"M","sp":"4243"},
 {"id":"4178","nfs_id":"K2XF-NS7","fn":"Priscilla Davis","s":"F","sp":"4177"},
 {"id":"4177","nfs_id":"KG9N-SSX","fn":"Cornelius White","s":"M","sp":"4178"},
 {"id":"4271","nfs_id":"KHNK-9CT","fn":"Barbara Bientz","s":"F","sp":"4270"},
 {"id":"4270","nfs_id":"KHKB-Z9H","fn":"Hans Hofer","s":"M","sp":"4271"},
 {"id":"4223","nfs_id":"L72J-69B","fn":"Alice","s":"F","sp":"4222"},
 {"id":"4222","nfs_id":"L72J-DTQ","fn":"John Mayall","s":"M","sp":"4223"},
 {"id":"4225","nfs_id":"L72J-61N","fn":"Mary","s":"F","sp":"4224"},
 {"id":"4224","nfs_id":"LW1M-3M2","fn":"James Shaw","s":"M","sp":"4225"},
 {"id":"4219","nfs_id":"2C1M-2NR","fn":"Mary Burns","s":"F","sp":"4218"},
 {"id":"4218","nfs_id":"L72N-494","fn":"James Mundell","s":"M","sp":"4219"},
 {"id":"4217","nfs_id":"L72N-6FD","fn":"Hannah Cook","s":"F","sp":"4216"},
 {"id":"4216","nfs_id":"L72N-X1M","fn":"Henrie","s":"M","sp":"4217"},
 {"id":"4221","nfs_id":"LWZ8-YTD","fn":"Ann Foster","s":"F","sp":"4220"},
 {"id":"4220","nfs_id":"LWZ8-B7R","fn":"John","s":"M","sp":"4221"},
 {"id":"4188","nfs_id":"K194-PPY","fn":"Mary Harvey","s":"F","sp":"4187"},
 {"id":"4187","nfs_id":"KLB4-Q1Z","fn":"Jacob Babbit","s":"M","sp":"4188"},
 {"id":"4190","nfs_id":"L4S1-TTB","fn":"Martha","s":"F","sp":"4189"},
 {"id":"4189","nfs_id":"L78B-6SX","fn":"Daniel Tefft","s":"M","sp":"4190"},
 {"id":"4235","nfs_id":"MDJV-NWX","fn":"Kroll","s":"F","sp":"4234"},
 {"id":"4234","nfs_id":"MDJV-NW3","fn":"Kroll","s":"M","sp":"4235"},
 {"id":"4213","nfs_id":"K1WZ-M43","fn":"Susanna Milton","s":"F","sp":"4212"},
 {"id":"4212","nfs_id":"K1WZ-FLB","fn":"John Clark","s":"M","sp":"4213"},
 {"id":"4174","nfs_id":"2DXL-G26","fn":"Nathan Mason","s":"M","sp":"4175"},
 {"id":"4209","nfs_id":"LWXF-YV2","fn":"Ann","s":"F","sp":"4208"},
 {"id":"4208","nfs_id":"LSS9-N3X","fn":"Henry Nixon","s":"M","sp":"4209"},
 {"id":"4201","nfs_id":"KNS3-2DM","fn":"Sarah Draper","s":"F","sp":"4062"},
 {"id":"4207","nfs_id":"LQRH-H6X","fn":"Mrs Isaacher Johnson","s":"F","sp":"4206"},
 {"id":"4206","nfs_id":"LSS9-F69","fn":"Isaacher Johnson","s":"M","sp":"4207"},
 {"id":"4211","nfs_id":"L7NQ-1Q7","fn":"Martha Shreve","s":"F","sp":"4210"},
 {"id":"4210","nfs_id":"249X-W7V","fn":"William Shinn","s":"M","sp":"4211"},
 {"id":"4184","nfs_id":"L4W8-7MG","fn":"Mary","s":"F","sp":"4183"},
 {"id":"4183","nfs_id":"L4W8-Q1W","fn":"Daniel Howland","s":"M","sp":"4184"},
 {"id":"4182","nfs_id":"LWSM-SNW","fn":"Mary Gardiner","s":"F","sp":"4181"},
 {"id":"4181","nfs_id":"L7LB-ZZZ","fn":"Nathaniel Gardiner","s":"M","sp":"4182"}]};
	
		
	var TestSupport = window.TestSupport = function() {
		
		var self = this;
		var _addedDivs = [];
		
		this.init = function(data) {
			self.sharingTime = SharingTime.getInstance(data);			
			self.focus = self.sharingTime.getFocus();
			test('script loaded and data initialized', function() {
				ok(self.sharingTime, 'script loaded');
				ok(self.focus, 'data initialized');
			});
		};								
		
		this.addDiv = function(id, parent) {
			var d1 = document.createElement("div");
			parent.appendChild(d1);
			$(d1).attr("id", id);
			_addedDivs.push($(d1));
			return d1;
		};
		
		var _cleanup = function() {
			for (var i in _addedDivs) {
				try { _addedDivs[i].remove(); }
				catch (e) { }
			}
		};
		
		this.basicData = data;
		this.extensionData = extensionData;
		this.circularDependencyData = circularDependencyData;
		
		var defaultParams = {
			chartDiv : "chart",
			chartContainer : "chartContainer",					
			chartType:'ancestor',
			orientation:'horizontal',
			defaults:{						
				highlightPaintStyle:{ lineWidth:4, strokeStyle:'#fff9b5' } // this is for highlighting connectors
			}
		};
		
		this.initUI = function(params) {
			_cleanup();
			params = params || {};
			var p = $.extend({}, defaultParams);
			params = $.extend(p, params);
			var cc = self.addDiv("chartContainer", document.body);
			var c = self.addDiv("chart", cc);
			var w = self.addDiv("wait", cc);				
			var ui = new SharingTimeUI();
			var loadError = null;
			try {
			ui.initialize(self.sharingTime, p);
			} catch (e) { 
				loadError = e;
			}	
			
			test('ui setup', function() {
				equals(loadError, null, "no loading errors");
				ok(ui != null, "ui exists .");
			});	
		};
			
	};
})();