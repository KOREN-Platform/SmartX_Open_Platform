/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.DataLake;

import org.bson.Document;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

public class MongoDB_Connector {
	private MongoClient mongoClient;
	private MongoDatabase db;
	
	//Create Database Connection
	public void setDbConnection(String dbHost, int dbPort, String dbName) {
		mongoClient  = new MongoClient(dbHost , dbPort);
		this.db      = mongoClient.getDatabase(dbName);
	}
	
	//Get Database Connection Object
	public MongoDatabase getDbConnection() {
		return db;
	}
	
	//Insert Single Data document in specfic collection
	public void insertDataDB(String collection, Document document){
		db.getCollection(collection).insertOne(document);
	}
	
	//Delete All records
	public DeleteResult deleteDataDB(String collection){
		DeleteResult deleteResult;
		deleteResult = db.getCollection(collection).deleteMany(new Document());
		return deleteResult;
	}
	
	//Get all records
	public FindIterable<Document> getDataDB(String collection){
		FindIterable<Document> result = db.getCollection(collection).find();
		return result;
	}
	
	//Get all records with given key condition
	public FindIterable<Document> getDataDB(String collection, String queryIdentifierOneKey, String queryIdentifierOneValue){
		FindIterable<Document> result = db.getCollection(collection).find(new Document(queryIdentifierOneKey, queryIdentifierOneValue));
		return result;
	}
}
