import { Pool } from "pg";
import { postgres } from "../../configs";

class PostgresDB
{
    private _pool: Pool;

    public constructor ()
    {
        this._pool = new Pool({
            user:'postgres',
            password:'login123',
            host:'localhost',
            database:'game',
            port:2602
        });
    }

    public get pool ()
    {
        return this._pool;
    }

    /**
     * Função recebe a tabela e um objeto e retorna o objeto inserido
     * @param table string
     * @param atributes T
     * @returns 
     */
    public async insert <T> (table: string, atributes: T): Promise<T[]>
    {
        try 
        {
            const values: object[] = [];
            let indexes = '';
            const keys = Object.keys(atributes as any).reduce((q, key, i) => 
            {
                values.push((atributes as any)[key]);
                indexes += `${q != ''? ', ' : ''}$${i+1}`;
                return q + `${q != ''? ', ' : ''}"${key}"`;
            }, '');
            const queryString = `INSERT INTO ${table} (${keys}, created_at) VALUES (${indexes}, now()) RETURNING id`;
            console.log(queryString, values);
            
            const result = await this.pool.query(queryString, values);

            if(result.rows && result.rows.length !== 0) return result.rows;

            return [];
        }
        catch(e)
        {
            console.log("Insert error: ", e);
            throw new Error("503: service temporarily unavailable");
        }
    }

    /**
     * Função recebe a tabela, um objeto e um filtro(opcional) e retorna o objeto atualizado
     * @param table string
     * @param atributes T
     * @param filter T
     * @returns 
     */
    public async update <T> (table: string, atributes: Partial<T>, filter: Partial<T> = {}): Promise<T[]>
    {
        try 
        {
            const filterstring = Object.keys(filter).reduce((q, key) => 
            {
                return q + `${q != ''? ' AND ' : ''}${key} = '${(filter as any)[key]}'`;
            }, '');

            const values: any[] = [];
            const keys = Object.keys(atributes).reduce((q, key, i) => 
            {
                values.push((atributes as any)[key]);
                return q + `${q != ''? ', ' : ''}"${key}" = $${i+1}`;
            }, '');

            const queryString = `UPDATE ${table} SET updated_at=now(), ${keys}${filterstring==''?'':' WHERE '+filterstring} RETURNING id`;
            
            const result = await this.pool.query(queryString, values);

            if(result.rows && result.rows.length !== 0) return result.rows;

            return [];
        }
        catch(e)
        {
            console.log("Update error: ", e);
            throw new Error("503: service temporarily unavailable");
        }
    }

    /**
     * Função recebe a tabela e um filtro(opcional) e retorna o objeto procurado
     * @param table string
     * @param filter T
     * @returns 
     */
    public async select <T> (table: string, filter: Partial<T> = {}, view: string[] = []): Promise<T[]>
    {
        try 
        {
            const filterstring = Object.keys(filter).reduce((q, key) => 
            {
                return q + `${q != ''? ' AND ' : ''}${key} = '${(filter as any)[key]}'`;
            }, '');
            const viewstring = view.length > 0?`(${view.join(", ")})`:'*';

            const queryString = `SELECT ${viewstring} FROM ${table}${filterstring==''?'':' WHERE '+filterstring} ORDER BY created_at DESC`;
            
            const result = await this.pool.query(queryString);

            if(result.rows && result.rows.length !== 0) 
            {
                result.rows.forEach((element : any) => 
                {
                    for(const key in element)
                    {
                        if(element[key] == null) delete element[key]; 
                    }    
                });
                return result.rows;
            }

            return [];
        }
        catch(e)
        {
            console.log("Select error: ", e);
            throw new Error("503: service temporarily unavailable");
        }
    }

    /**
     * Função recebe a tabela, uma string e um filtro(opcional) e retorna o objeto deletado
     * @param table string
     * @param deletedName string
     * @param filter T
     * @returns 
     */
    public async remove <T> (table: string, deletedName: string, deleted_by='', filter: Partial<T> = {}): Promise<T[]>
    {
        try 
        {
            const filterstring = Object.keys(filter).reduce((q, key) => 
            {
                return q + `${q != ''? ' AND ' : ''}${key} = '${(filter as any)[key]}'`;
            }, '');

            const queryString = `UPDATE ${table} SET ${deletedName}_at=now()${deleted_by==''?'':`${deletedName}_by=$1`}${filterstring==''?'':' WHERE '+filterstring} RETURNING id`;
            
            const result = await this.pool.query(queryString, [deleted_by]);

            if(result.rows && result.rows.length !== 0) return result.rows;

            return [];
        }
        catch(e)
        {
            console.log("Update error: ", e);
            throw new Error("503: service temporarily unavailable");
        }
    }

    public async sequenceNext (sequence: string) : Promise<boolean>
    {
        try 
        {
            await this.pool.query(`SELECT nextval('${sequence}');`);
            return true;
        }
        catch(e)
        {
            console.log("Sequence Next", e);
            return false;
            //throw new Error("503: service temporarily unavailable");
        }
    }

    public async sequenceSet (sequence: string, value:number) : Promise<boolean>
    {
        try 
        {
            await this.pool.query(`SELECT set('${sequence}, ${value}');`);
            return true;
        }
        catch(e)
        {
            console.log("Sequence Set", e);
            return false;
        }
    }

    public async sequenceGet (sequence: string) : Promise<string>
    {
        try 
        {
            const result = await this.pool.query(`SELECT * FROM ${sequence}`);
            //console.log(result)

            if(!result.rows || result.rows.length === 0) return "0";
            const seq = result.rows[0];
            const ag = seq.last_value;
            if(!seq.is_called) await this.sequenceNext(sequence);
            //console.log(ag)
            return `${ag}`;
        }
        catch(e)
        {
            console.log("Get Sequence:", e);
            return '-1';
        }
    }
}

export default new PostgresDB();