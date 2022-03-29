$quiz.on('trigger-poll',p=>{
	// poll $title:string
	// poll $list:string
	// poll $colors:string
	// poll $unit:select:count|percent
	// poll $duration:int:10:120
	// poll $choiceVar:string
	// poll $winnerVar:string
	if(!p.list) return;
	var P = $scope.poll = [];
	P.unit = p.unit || 'count';
	P.votes=0;
	P.max=1;
	P.title=p.title;
	var k=0, col = (p.colors || '').split(',');
	p.list.split(',').forEach(c=>{
		c = c.trim();
		P.push({id:c,votes:0,color:col[k++]||''});
	});
	P.vote = i=>{
		if(p.choiceVar) $player.set(p.choiceVar,P[i].id);
		$quiz.msg({t:'poll',i:i});
		P.voted=1;
	};
	$timeout(()=>{
		$scope.poll=0;
		if(p.winnerVar) $player.set(p.winnerVar,P.reduce((a, b) => a.votes >= b.votes ? a : b).id);
	},(p.duration || 30)*1000);
});

$quiz.on('msg-poll',p=>{
	var P = $scope.poll;
	var v = ++P[p.i].votes;
	if(v>P.max) P.max=v;
	P.votes++;
});