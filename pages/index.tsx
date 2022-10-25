import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import Layout from '../components/Layout';
import RichTextEditor from '../components/RichText';
import TaskColumn from '../components/TaskColumn';

const Home: NextPage = () => {
    const [editorState, setEditorState] = useState("");
    return (
        <div>
            <Layout>
                <div className="flex justify-between">
                    {/*
                    <div className="block p-2 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <RichTextEditor
                    name="test"
                    onChange={(text: string) => {
                    setEditorState(text)
                    }}
                    />
                    </div>
                */}
                    <TaskColumn />
                </div>
            </Layout>
        </div>
    )
}

export default Home
