let UserModel = ['id','email','name','password'];
let WordModel = ['id','word','definition','status', 'wordtype'];
let SynonymModel = ['id','synword_id','synonymto_id','status'];
let UserWordRelationModel = ['id','user_id','word_id', 'status', 'notes'];
let SentecesModel = ['id','sentence','word_id','status'];
let UserSessionsModel = ['id','sesssionId','user_id','createdDate'];