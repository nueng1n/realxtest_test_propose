import { useEffect, useState } from 'react';
import useNavigation from '../hooks/use-navigation';
import Dropdown from '../components/Dropdown';
import SortableTableSql from '../components/SortableTableSql';

import useCore from '../hooks/use-core';
import { NavigationContextType } from '../interface/navigation'
import { CoreContextType, Post, TagOption, PostsResponse } from '../interface/core'
import { Option } from '../interface/dropdown'


function PostPage() {
    

    const { getPosts, getTags } = useCore() as CoreContextType;
    const [data, setData] = useState<Post[]>([]);

    const [hasToken, setHasToken] = useState<boolean>(false);
    const { navigate } = useNavigation() as NavigationContextType;

    const [selection, setSelection] = useState<Option | null>(null);
    const [selectionData, setSelectionData] = useState<Option[] | null>([]);

    const [selection2, setSelection2] = useState<Option | null>(null);
    const [selection2Data, setSelection2Data] = useState<Option[] | null>([]);

    const [search, setSearch] = useState('');

    const handleSearchChange = (event: any) => {
        setSearch(event.target.value);
    };

    const [curretPage, setcurretPage] = useState(-1);

    const handleSelect = (option: Option) => {
        setSelection(option);
    };

    const handleSelect2 = async (option: Option) => {

        setSelection2(option);
        const token = localStorage.getItem('token');

        try {
            let searchValue = "";
            let selectionValue = "";

            if (search) {
                searchValue = search;
            }

            if (selection) {
                selectionValue = selection.value;
            }

            const jsonData: PostsResponse = await getPosts(token as string, parseInt(option.value), searchValue, selectionValue, []);

            let pages = jsonData.totalPages;

            let select2 = [];
            for (let i = 1; i <= pages; i++) {
                select2.push({
                    value: i.toString(),
                    label: i.toString()
                });
            }

            setSelection2Data(select2);
            setData(jsonData.posts);
            setcurretPage(jsonData.currentPage);

        } catch (e) {
            console.log("go to page ", e);

        }

    };


    const keyFn = (post: Post) => {
        return post.post_id.toString();
    };


    const handleLogout = () => {
        localStorage.clear()
        navigate("/")
    }



    const config = [
        {
            label: 'post_title',
            render: (post: Post) => post.post_title,
            sortValue: (post: Post) => post.post_title,
        },
        {
            label: 'post_at',
            render: (post: Post) => post.post_at,
            sortValue: (post: Post) => post.post_at,
        },
        {
            label: 'tags',
            render: (post: Post) => {
                if (post.tags && post.tags.length > 0) {
                    return post.tags.map(tag => tag.tag_name).join(',');
                }
                return "-";
            }
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setHasToken(true)

            const fetchData = async () => {
                try {
                    const jsonData: PostsResponse = await getPosts(token, 1, "", "", []);


                    let pages = jsonData.totalPages

                    let select2 = []
                    for (let i = 1; i <= pages; i++) {
                        select2.push({
                            value: i.toString(),
                            label: i.toString()
                        })
                    }

                    setSelection2Data(select2)
                    setData(jsonData.posts);
                    setcurretPage(jsonData.currentPage)
                } catch (error: any) {
                    if (error.response && error.response.status) {
                        console.error('Error fetching data. Status code:', error.response.status);

                        if (error.response.status == 403) {
                            localStorage.clear()
                        }
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            };


            const fetchTags = async () => {
                try {
                    const jsonData: TagOption[] = await getTags(token);

                    const tagsWithNewLabel = jsonData.map(tag => ({
                        value: tag.tag_name,
                        label: tag.tag_name
                    }));



                    setSelectionData(tagsWithNewLabel)


                } catch (error: any) {
                    console.error('Error fetching tag:', error);

                    if (error.response && error.response.status) {
                        console.error('Error fetching data. Status code:', error.response.status);

                        if (error.response.status == 403) {
                            localStorage.clear()
                        }
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            };



            fetchData();
            fetchTags();

        } else {
            navigate("/")
        }
    }, [navigate]);



    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        try {
            let searchValue = "";
            let selectionValue = "";

            if (search) {
                searchValue = search;
            }

            if (selection) {
                selectionValue = selection.value;
            }

            const jsonData: PostsResponse = await getPosts(token as string, curretPage, searchValue, selectionValue, []);

            let pages = jsonData.totalPages;

            let select2 = [];
            for (let i = 1; i <= pages; i++) {
                select2.push({
                    value: i.toString(),
                    label: i.toString()
                });
            }

            setSelection2Data(select2);
            setData(jsonData.posts);
            setcurretPage(jsonData.currentPage);
        } catch (error) {
            console.error('Error filter :', error);
        }
    };


    const sortPost = async (sort: any) => {

        const token = localStorage.getItem('token');

        try {

            let searchValue = "";
            let selectionValue = "";

            if (search) {
                searchValue = search;
            }

            if (selection) {
                selectionValue = selection.value;
            }

            const jsonData: PostsResponse = await getPosts(token as string, curretPage, searchValue, selectionValue, sort);

            let pages = jsonData.totalPages;

            let select2 = [];
            for (let i = 1; i <= pages; i++) {
                select2.push({
                    value: i.toString(),
                    label: i.toString()
                });
            }

            setSelection2Data(select2);
            setData(jsonData.posts);
            setcurretPage(jsonData.currentPage);

        } catch (e) {
            console.log("sort ", e);

        }

    };


    if (hasToken) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="max-w-screen-md w-full flex items-center justify-between mb-4">
                    <form className="flex items-center" onSubmit={handleSubmit}>
                        <input
                            className="border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 px-4 py-2 mr-2"
                            id="inputSearch"
                            type="text"
                            placeholder="Input Search"
                            value={search} onChange={handleSearchChange}
                        />
                        <label htmlFor="filterTag" className="px-4 py-2 mr-2">Filter Tag</label>
                        <div className=" px-4 py-2 mr-2">
                            <Dropdown options={selectionData as Option[]} value={selection} onChange={handleSelect} />
                        </div>
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        >
                            Search And Filter
                        </button>
                    </form>




                    <button
                        className="bg-gray-500 text-white font-bold py-1 px-2 rounded text-sm"
                        onClick={handleLogout}
                        style={{ position: 'fixed', top: '0', left: '0', margin: '10px' }}
                    >
                        Logout
                    </button>
                </div>
                <div className="w-full border-b mb-4"></div>
                <div>
                    <SortableTableSql sortPost={sortPost} data_={data} config={config} keyFn={keyFn} />
                </div>
                <div className="max-w-screen-md w-full mt-4 flex justify-between">
                    <label htmlFor="goToPage" className="px-4 py-2 mr-2">CurrenPage:{curretPage}    Go to Page</label>

                    <div className=" px-4 py-2 mr-2">
                        <Dropdown options={selection2Data as Option[]} value={selection2} onChange={handleSelect2} />
                    </div>

                </div>
            </div>
        );
    } else {


        return null
    }




}


export default PostPage