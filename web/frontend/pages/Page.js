import { h, Component } from 'preact';

import Heart from '../components/icons/Heart';

import fetch from '../utils/fetch';

export default class Page extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            fetch: {
                content: false
            },
            content: false
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getContent(this.props);
    }

    /**
     * Function runs before component updates
     *
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
        if(nextProps !== this.props) {
            this.getContent(nextProps);
        }
    }

    /**
     * Get all content from the content API
     *
     * @param props
     */
    async getContent(props) {
        const content = await fetch(`${window.expressConfig.contentApi}/${props.slug}`);

        if (content && content.status.success) {
            this.setState({
                fetch: {
                    ...this.state.fetch,
                    content: true
                },
                content: content.data
            });
        } else {
            this.setState({
                fetch: {
                    ...this.state.fetch,
                    content: true
                },
                content: false
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {content, fetch} = this.state;

        if(!fetch.content) {
            return null;
        }

        if(!content) {
            return (
                <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-gray-100">
                    <span className="border border-dashed border-secondary flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-primary">
                        <Heart/>
                    </span>
                    <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Not Found</h2>
                    <p className="text-accent-6 px-10 text-center pt-2">It seems you are lost<br/><a href="/" className="hover:underline">Want to go back to the home page?</a></p>
                </div>
            );
        }

        return (
            <main>
                <div className="grid max-w-screen-lg grid-cols-1 gap-6 p-4 mx-auto md:px-8 text-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                        {content.title}
                    </h1>
                    <div className="wysiwyg-html" dangerouslySetInnerHTML={{__html: content.html}}/>
                </div>
            </main>
        );
    }
}
