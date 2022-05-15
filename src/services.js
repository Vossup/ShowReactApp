import { pool } from './mysql-pool';

class ShowService {
  getShows() {
    return new Promise( (resolve, reject) =>{
      pool.query('SELECT * FROM Shows', (error, results) => {
        if (error) reject(console.error(error));
  
        resolve(results);
      });
    })
  }

  getShow(id) {
    return new Promise ( (resolve) =>{
      pool.query('SELECT * FROM Shows WHERE id=?',
      [id],
      (error, results) =>{
        if (error){return console.error(error);}
  
        resolve(results[0]);
      });
    })
  }

  updateShow(show, success) {
    pool.query(
      'UPDATE Shows SET title=?, description=? WHERE id=?',
      [show.title, show.description, show.showId],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}
export let showService = new ShowService();
