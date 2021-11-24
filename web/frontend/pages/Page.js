import { h, Component } from 'preact';

import Heart from '../components/icons/Heart';

import fetch from '../utils/fetch';
import wishlist from '../utils/wishlist';

export default class Page extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
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
                content: content.data
            });
        } else {
            this.setState({
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
        const {content} = this.state;

        // @todo add 404 alternative page
        if(!content) {
            return null;
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
