let scale = '50,30,20';

    let publicScale=parseInt(scale.substring(0,scale.indexOf(',')));
    let subpublicScale=parseInt(scale.substring(scale.indexOf(',')+1,scale.lastIndexOf(',')));
    let professionalScale=parseInt(scale.substring(scale.lastIndexOf(',')+1));
    console.log( Math.floor(((publicScale+2)/100)*90))

    score = 100/90; //to set the value of each question. the value is 2 at present.
    console.log(score = score.toFixed(1));
   