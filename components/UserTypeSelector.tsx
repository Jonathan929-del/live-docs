// Import
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';





// Main function
const UserTypeSelector = ({userType, setUserType, onClickHandler}:UserTypeSelectorParams) => {

    // Access change handler
    const accessChangeHandler = (type:UserType) => {
        setUserType(type)
        onClickHandler && onClickHandler(type);
    };

    return (
        <Select
            value={userType}
            onValueChange={(type:UserType) => accessChangeHandler(type)}
        >
            <SelectTrigger className='shad-select'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className='border-none bg-dark-200'>
                <SelectItem
                    value='view'
                    className='shad-select-item'
                >
                    can view
                </SelectItem>
                <SelectItem
                    value='edit'
                    className='shad-select-item'
                >
                    can edit
                </SelectItem>
            </SelectContent>
        </Select>
    );
};





// Export
export default UserTypeSelector;