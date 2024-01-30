const {
    readFragment, 
    writeFragment,
    readFragmentData,
    writeFragmentData, 
    listFragments, 
    deleteFragment,
    } = require('../../src/model/data/memory/index');

describe('In-memory database test for backend', ()=>{

    test('readFragment() returns the metadata written into database', async()=>{
        const data ={fragment:"abcd", id:"a", ownerId:"b"};
        await writeFragment(data);
        const result= await readFragment("b", "a");
        expect(result).toBe(data);
    })

    test('readFragment() throws when id and ownerId are non-existent',async()=>{
        expect(()=>{readFragment('owner','dataId').expect.toThrow();})
    })

    test('writeFragment() returns nothing', async()=>{
        const data={fragment:"abcd", id:"a", ownerId:"b"};
        const result= await writeFragment(data);
        expect(result).toBe(undefined);
    })

    test('testing readFragmentData() returns fragment data written into database', async()=>{
        const data="Fragment data";
        await writeFragmentData("b", "a", data);
        const result=await readFragmentData("b","a");
        expect(result).toBe(data);
    })

    test('readFragmentData() throws when id and ownerId are non-existent',async()=>{
        expect(()=>{readFragmentData('owner','dataId').rejects.toThrow();})
    })

    test('writeFragmentData() returns nothing', async()=>{
        const data="Fragment Data";
        const result=await writeFragmentData("b","a",data);
        expect(result).toBe(undefined)
    })

    test('listFragments() returns a list of fragment ids for fragments with same ownerId', async()=>{
        await writeFragment({fragment:"abcd", id:"1", ownerId:"a"});
        await writeFragment({fragment:"efgh", id:"2", ownerId:"a"});
        const result=await listFragments("a");
        expect(result).toEqual(['1','2']);
    })

    test('listFragments() returns an expanded list of fragment ids with same ownerId when expanded is true', async()=>{
        await writeFragment({fragment:"abcd", id:"1", ownerId:"a"});
        await writeFragment({fragment:"efgh", id:"2", ownerId:"a"});
        const result=await listFragments("a", true);
        expect(result).toEqual([
            {fragment:"abcd", id:"1", ownerId:"a"},
            {fragment:"efgh", id:"2", ownerId:"a"}
        ]);
    })

    test('deleteFragment() deletes fragments and its metadata from memory-db', async()=>{
        const data={fragment:"abcd", id:"1", ownerId:"a"};
        await writeFragment(data);
        await writeFragmentData("a", "1", "abcd");

        const result1= await readFragment("a", "1");
        expect(result1).toBe(data);
        const result2=await readFragmentData("a","1");
        expect(result2).toEqual(data.fragment);
        
        await deleteFragment("a","1");
        expect(()=>{readFragmentData("a","1").rejects.toThrow();})
        expect(()=>{readFragment("a","1").rejects.toThrow();})
    })
})